import _ from "lodash";
import bcrypt from "bcrypt";
import { CountryCode } from "libphonenumber-js";

// import Mail from "../helpers/mail";
import CustomError from "../helpers/customError";
import PhoneNumber from "../helpers/phoneNumber";

import { logger } from "../utils/logger";
import { STATUS } from "../utils/appConstant";
import { LOGGER_MESSAGES } from "../utils/logConstant";
import { CLIENT_ERROR_MESSAGES, CLIENT_MESSAGES } from "../locales/langConstant";
import { DynamicFields } from "../utils/customTypes";

import { createIdentity, findOneAndUpdateIdentity, findOneIdentity } from "../models/identityModel";
import { findOneUser, createUser, findByIdAndUpdateUser, generateAuthToken } from "../models/userModel";


interface UserRegistrationData extends DynamicFields {
    name: string;
    email: string;
    mobile: string;
    timeZone: string;
    preferredLanguage: string;
    identityType: string;
    identityValue: string;
    password: string;
    countryCode: CountryCode;
}
const PHONE_NUMBER = new PhoneNumber();
// const MAIL = new Mail();

export default class UserService {

    /**
     * User registration
    */
    async registerUser(userData: UserRegistrationData, req: any): Promise<Record<string, any>> {
        try {
            const { name, email, mobile, timeZone, preferredLanguage, identityType, identityValue, password, countryCode } = userData;
            const emailId: string = email.toLowerCase();

            const language: string = req?.headers["accept-language"] || "en";
            const errorMessages = CLIENT_ERROR_MESSAGES[language] || CLIENT_ERROR_MESSAGES["en"];
            const messages = CLIENT_MESSAGES[language] || CLIENT_MESSAGES["en"];

            // Check if the user with the provided email already exists
            const EMAIL_EXIST = await findOneUser({ email: emailId, status: [STATUS.ACTIVE, STATUS.PENDING] });
            if (!_.isNil(EMAIL_EXIST)) {
                logger.error(LOGGER_MESSAGES.EXISTING_USER);
                throw new CustomError(errorMessages.EXISTING_USER);
            }

            const isValidMobile = await PHONE_NUMBER.validatePhoneNumber(mobile, countryCode, req);

            // Create a new user with the provided data
            const USER = await createUser({
                name: name?.trim(),
                email,
                mobile: isValidMobile || mobile,
                identity: [{
                    type: identityType,
                    value: identityValue
                }],
                settings: {
                    timeZone,
                    preferredLanguage
                }
            });

            const expiryDate = new Date();
            expiryDate.setDate(expiryDate.getDate() + 7);

            // Create an identity for the user with a hashed password
            await createIdentity({
                userId: USER?._id,
                password: [
                    {
                        value: await bcrypt.hash(password, 10)
                    }
                ]
            });

            // Pick only specific properties from the user object for the response
            const USER_RESPONSE = _.pick(USER, ["_id", "name", "email", "mobile", "settings", "status"]);
            // MAIL.send(USER_RESPONSE);
            return { data: USER_RESPONSE, message: messages["USER_CREATE"] };
        } catch (error: any) {
            throw new CustomError(error.message);
        }
    }

    /**
     * Function to verify the email
     */
    async verifyEmail(userData: Record<string, string | undefined>, req: any) {
        try {
            const { user_id } = userData;

            const language: string = req?.headers["accept-language"] || "en";
            const errorMessages = CLIENT_ERROR_MESSAGES[language] || CLIENT_ERROR_MESSAGES["en"];
            const messages = CLIENT_MESSAGES[language] || CLIENT_MESSAGES["en"];

            const VERIFY_EMAIL = await findOneUser({ _id: user_id, status: { $in: [STATUS.PENDING, STATUS.ACTIVE] } });
            if (_.isNil(VERIFY_EMAIL)) {
                throw new CustomError(errorMessages.USER_NOT_FOUND);
            } else if (VERIFY_EMAIL?.status === STATUS.ACTIVE) {
                throw new CustomError(errorMessages.ALREADY_VERIFIED);
            }

            // Update the user's status to ACTIVE since verification is successful
            await findByIdAndUpdateUser({ _id: user_id }, { status: STATUS.ACTIVE });
            return { message: messages["EMAIL_VERIFICATION"] };
        } catch (error: any) {
            throw new CustomError(error.message);
        }
    }

    /**
     *  Function to handle user login
     */
    async login(userData: UserRegistrationData, req: any) {
        try {
            const { email, password } = userData;
            const emailId: string = email.toLowerCase();

            const language: string = req?.headers["accept-language"] || "en";
            const errorMessages = CLIENT_ERROR_MESSAGES[language] || CLIENT_ERROR_MESSAGES["en"];
            const messages = CLIENT_MESSAGES[language] || CLIENT_MESSAGES["en"];

            const USER = await findOneUser({ email: emailId, status: { $in: [STATUS.ACTIVE, STATUS.PENDING, STATUS.INACTIVE] } });
            if (_.isNil(USER)) {
                throw new CustomError(errorMessages.INVALID_EMAIL_OR_PASSWORD);
            }
            if (USER?.status === STATUS.PENDING) {
                throw new CustomError(errorMessages.EMAIL_VERIFY_PENDING);
            }

            const identity = await findOneIdentity({ userId: USER?._id });
            const orignalPassword = identity?.password && identity?.password.find(ele => ele?.status === STATUS.ACTIVE);

            // Check if the entered password matches the stored hashed password
            if (orignalPassword && await bcrypt.compare(password, orignalPassword?.value)) {
                const accessToken = generateAuthToken(USER);
                // Update the user's identity with the new token and its expiry date
                await findOneAndUpdateIdentity({ userId: USER?._id }, { token: { accessToken, expiryDate: new Date() } });
                return {
                    message: messages["LOGIN_SUCCESSFUL"],
                    data: {
                        authDetails: {
                            accessToken,
                        },
                        userDetails: {
                            _id: USER?._id,
                            name: USER?.name,
                            email: USER?.email,
                            role: USER?.role,
                            status: USER?.status,
                        }
                    }
                };
            }
            throw new CustomError(errorMessages.INVALID_EMAIL_OR_PASSWORD);
        } catch (error: any) {
            throw new CustomError(error.message);
        }
    }
}