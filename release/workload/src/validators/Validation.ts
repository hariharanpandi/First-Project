import Joi from 'joi';
import AppConstants from "../utils/constant";

const appConstant = new AppConstants();
export default class Validation {
    workload = Joi.object({
        workload_name: Joi.string().min(3).max(20).trim().required().label('workload_name'),
    });
}