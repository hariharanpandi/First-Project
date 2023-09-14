const Joi = require("joi");
import AppConstants from "../utils/constant";

const appConstant = new AppConstants();

export default class Validation {
    /** 
     * Defining validation schema for user registration
     */
    userRegister = Joi.object({
        user_name: Joi.string().trim().min(3).max(20).required().label('name'),
        email: Joi.string().email().trim().required().label('email')
    });

    /**
    * Defining validation schema for tenant registration
    */
    tenantRegister = Joi.object({
        // user_name: Joi.string().trim().min(1).max(50).required().label('user_name'),
        // last_name: Joi.string().trim().min(1).max(50).required().label('last_name'),
        email: Joi.string().email().trim().required().label('email'),
        org_name: Joi.string().trim().min(1).max(50).required().label('org_name'),
        domain_name: Joi.string().trim().min(1).max(50).required().label('domain_name'),
        login_type: Joi.string().trim().min(1).max(50).label('user_id'),
        user_type: Joi.string().trim().max(1).label('user_type'),
        status: Joi.string().allow(appConstant.SCHEMA.STATUS_ACTIVE, appConstant.SCHEMA.STATUS_INACTIVE).label('status'),
        password: Joi.string().min(6).max(255).required().label('password'),
        contact_name: Joi.string().min(6).max(255).label('contact_name'),
        contact_info: Joi.string().min(6).max(255).label('contact_info'),
        sso_enabled: Joi.string().allow(appConstant.SCHEMA.ISACTIVE, appConstant.SCHEMA.ISINACTIVE).label('status')
    });

    /**
    * Defining validation schema for tenant registration
    */
    password = Joi.object({
        password: Joi.string().min(6).max(255).required().label('password')
    });

    /**
     * Below function is used for schema validation
     */
    async validateUserName(data: any) {
        const schema = Joi.object({
            first_name: Joi.string().trim().min(1).max(50).label('first_name'),
            last_name: Joi.string().trim().min(1).max(50).label('last_name'),
            password: Joi.string().min(6).max(255).label('password'),
        });

        return schema.validate(data);
    }
}