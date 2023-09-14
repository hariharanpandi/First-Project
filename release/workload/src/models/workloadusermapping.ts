import mongoose, { Document, Schema } from "mongoose";
import AppConstants from "../utils/constant";
import { ObjectId } from "mongodb";

const appConstant = new AppConstants();

interface IUserMapping {
    user_id: string,
    role_id: string,
    role_name: string
}

interface IAWorkloadUser extends Document {
    tenant_id: string,
    tenant_group_id: string,
    project_id: string,
    application_id: string,
    workload_id: string,
    workload: IUserMapping[],
    status: string,
    created_by_user_id: string,
    created_at: Date,
    updated_by_user_id: string,
    updated_at: Date,
}

const workloadUserSchema: Schema<IAWorkloadUser> = new mongoose.Schema({
    _id: {
        type: String,
        default: () => new mongoose.Types.ObjectId().toString('hex'),
    },
    tenant_id: {
        type: String,
        required: true,
        index: true
    },
    tenant_group_id: {
        type: String,
        required: true
    },
    project_id: {
        type: String,
        required: true
    },
    application_id: {
        type: String,
        required: true,
        index: true
    },
    workload_id: {
        type: String,
        required: true,
        index: true
    },
    workload: [
        {
            _id: false,
            user_id: {
                type: String,
                required: true,
                index: true
            },
            role_id: {
                type: String,
                index: true
            },
            role_name: {
                type: String
            }
        }
    ],
    status: {
        type: String,
        enum: [appConstant.SCHEMA.STATUS_ACTIVE, appConstant.SCHEMA.STATUS_INACTIVE],
        default: 'Active'
    },
    created_by_user_id: {
        type: String,
        required: true
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    updated_by_user_id: {
        type: String,
        required: true
    },
    updated_at: {
        type: Date,
        default: Date.now
    },
}, { collection: appConstant.SCHEMA.WORKLOAD_USERS_COLLEECTION_NAME });

export const WorkloadUser = mongoose.model<IAWorkloadUser>('WorkloadUser', workloadUserSchema);

export const workloadUserCreate = (values: any) => new WorkloadUser(values).save().then((workloadUserMap) => workloadUserMap.toObject());

/**
 * Find by dynamic fields 
 */
export const findByWorkloadUserMapFields = (dynamicFields: Record<string, any>) => WorkloadUser.find(dynamicFields).then((workloadUser) => {
    if (!workloadUser) {
        return null;
    }
    return workloadUser;
}).catch((error: any) => {
    return null;
});

export const findAndUpdateWorkloadUser = (application_id: any, workload_id: string, dynamicFields: any) => {
    const result = WorkloadUser.findOneAndUpdate(
        { application_id, workload_id },
        { $push: { workload: dynamicFields } },
        { new: true, runValidators: true }
    );
    return result;
};

export const findAndUpdateWorkloadNewUser = (application_id: any, dynamicFields: any) => {
    return WorkloadUser.findOneAndUpdate(
        { application_id, },
        { $push: { workload: dynamicFields } },
        { new: true, runValidators: true }
    );
};

export const removeAndupdateWorkload = (application_id: string, user_id: string, workload_id: string) => WorkloadUser.updateOne(
    {
        application_id,
        workload_id
    },
    { $pull: { 'workload': { user_id } } }
);

export const isUserExist = (dynamicFields: Record<string, any>) => WorkloadUser.findOne({
    application_id: dynamicFields.application_id,
    workload: {
        $elemMatch: {
            workload_id: dynamicFields.workload_id,
            user_id: dynamicFields.user_id,
        }
    }
});

export const findAndUpdateRole = (user_id: any, workload_id: any, role_id: any, role_name:any) => WorkloadUser.updateOne(
    { 'workload.user_id': user_id, workload_id }, { $set: { 'workload.$.role_id': role_id, 'workload.$.role_name': role_name } }
)