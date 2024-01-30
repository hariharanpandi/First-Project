import parsePhoneNumber, { PhoneNumber as ParsedPhoneNumber, CountryCode } from "libphonenumber-js";
import CustomError from "./customError";
import { getErrorMessage } from "../locales/translate";

export default class PhoneNumber {

    async validatePhoneNumber(phoneNumber: string, countryCode: CountryCode, req: any): Promise<string | undefined> {
        try {
            const parsedPhoneNumber: ParsedPhoneNumber | undefined = parsePhoneNumber(phoneNumber, countryCode);

            // Check if the parsed phone number is valid
            if (parsedPhoneNumber && parsedPhoneNumber.isValid())
                return parsedPhoneNumber.formatInternational();

            const errorMessages: string = (await getErrorMessage(req?.headers["accept-language"]) || {})["INVALID_MOBILE"] ?? "Validation error.";
            throw new CustomError(errorMessages);
        } catch (error: unknown) {
            if (error instanceof CustomError)
                throw new CustomError(error.message);
        }
        return undefined;
    }
}
