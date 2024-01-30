import Joi from "joi";

export default class Validation {
    /** 
     * Defining validation schema for user registration
     */
    userRegister = Joi.object({
        name: Joi.string().trim().min(3).max(32).required().label("Name"),
        email: Joi.string().email().trim().required().label("Email"),
        mobile: Joi.string().required().label("Mobile no"),
        timeZone: Joi.string().trim().required().label("Time zone"),
        preferredLanguage: Joi.string().trim().required().label("Preferred language"),
        identityType: Joi.string().trim().required().label("Identity type"),
        identityValue: Joi.string().trim().required().label("Identity value"),
        password: Joi.string().min(8).max(50).pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/).required().label("Password").messages({ "string.pattern.base": "Password must contain at least one lowercase letter, one uppercase letter, one digit, and one special character" }),
        countryCode: Joi.string().pattern(/^[A-Za-z]{2}$/).required().label("Country code").messages({ "string.pattern.base": "Please enter a valid two-letter country code." }),
    });

    login = Joi.object({
        email: Joi.string().email().trim().required().label("Email"),
        password: Joi.string().min(8).max(50).pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/).required().label("Password").messages({ "string.pattern.base": "Password must contain at least one lowercase letter, one uppercase letter, one digit, and one special character" })
    });
}