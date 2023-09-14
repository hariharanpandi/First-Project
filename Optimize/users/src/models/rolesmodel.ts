import mongoose, { Document, Schema } from "mongoose";
import AppConstants from "../utils/constant";
import { ObjectId } from "mongodb";
require('dotenv').config();

const appConstant = new AppConstants();

interface IRole extends Document {
    tenant_id: string;
    tenant_group_id: string;
    role_name: string;
    access_level: {
        project_access_lvl: string[];
        discovery_access_lvl: string[];
        app_access_lvl: string[];
        workload_access_lvl: string[];
    };
    status: string;
    created_by_user_id: string;
    created_at: Date;
    updated_by_user_id: string;
    updated_at: Date;
}

const roleSchema: Schema<IRole> = new mongoose.Schema({
    _id: {
        type: String,
        default: () => new mongoose.Types.ObjectId().toString('hex'),
    },
    tenant_id: {
        type: String,
        required: true
    },
    tenant_group_id: {
        type: String,
        required: true
    },
    role_name: {
        type: String,
        required: true
    },
    access_level: {
        project_access_lvl: {
            type: [String],
            required: true
        },
        discovery_access_lvl: {
            type: [String],
            required: true
        },
        app_access_lvl: {
            type: [String],
            required: true
        },
        workload_access_lvl: {
            type: [String],
            required: true
        }
    },
    status: {
        type: String,
        required: true,
        index: true
    },
    created_by_user_id: {
        type: String,
        required: true
    },
    created_at: {
        type: Date,
        required: true
    },
    updated_by_user_id: {
        type: String,
        required: true
    },
    updated_at: {
        type: Date,
        required: true
    }
}, { collection: appConstant.SCHEMA.ROLE_COLLECTION });

/**
 * Get all roles
 */
export const getAllRoles = (dynamicFields: Record<string, any>) => Role.find(dynamicFields);
const Role = mongoose.model<IRole>('Role', roleSchema);

/**
 * Find  by dynamic fields
 */
export const findByRoleId = (_id: string) =>  Role.findOne({_id});

export { Role, roleSchema };