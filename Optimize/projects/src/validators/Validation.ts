const Joi = require('joi');
import AppConstants from "../utils/constant";

const appConstant = new AppConstants();
export default class Validation {

    /**
     * Project validation
     */
    project = Joi.object({
        project_name: Joi.string().trim().min(3).max(50).required().label('project_name'),
        description: Joi.string().trim().min(5).max(360).required().label('description')
    });

    /**
     * Application validation
     */
    application = Joi.object({
        app_name: Joi.string().trim().min(3).max(50).required().label('app_name'),
        description: Joi.string().trim().min(5).max(360).required().label('description'),
        project_id: Joi.string().trim().label('project_id'),
        imageremove:Joi.boolean()
    });
}