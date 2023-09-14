import mongoose, { Document, Schema } from "mongoose";
import AppConstants from "../utils/constant";

const appConstant = new AppConstants();

interface IUserMapping {
    user_id: string,
    role_id: string,
    role_name: string,
    created_by_user_id: string,
    created_at: Date,
    updated_by_user_id: string,
    updated_at: Date
}

interface IProjectUser extends Document {
    tenant_id: string;
    tenant_group_id: string;
    project_id: string;
    users_mapping: IUserMapping[];
    status: string;
    created_by_user_id: string;
    created_at: Date;
    updated_by_user_id: string;
    updated_at: Date;
}

const projectUserSchema: Schema<IProjectUser> = new mongoose.Schema({
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
    project_id: {
        type: String,
        required: true,
        index: true
    },
    users_mapping: [
        {
            _id: false,
            user_id: {
                type: String,
                required: true,
                index: true
            },
            role_id: {
                type: String,
                required: true
            },
            role_name: {
                type: String
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
                required: true,
            },
            updated_at: {
                type: Date,
                default: Date.now
            }
        }
    ],
    status: {
        type: String,
        enum: [appConstant.SCHEMA.STATUS_ACTIVE, appConstant.SCHEMA.STATUS_INACTIVE],
        default: 'Active',
        index: true
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
        type: Date
    },
}, { collection: "Test_Project" });

projectUserSchema.index({ 'users_mapping.user_id': 1, 'status': 1, 'project_id': 1 });

export const ProjectUser = mongoose.model<IProjectUser>('ProjectUser', projectUserSchema);

export const projectUserCreate = (values: any) => new ProjectUser(values).save().then((projectUserMap) => projectUserMap.toObject());

/**
 * Find by dynamic fields 
 */
export const findByProjectUserMapFields = (dynamicFields: Record<string, any>) => ProjectUser.findOne(dynamicFields).then((projectUser) => {
    if (!projectUser) {
        return null;
    }
    return projectUser;
}).catch((error: any) => {
    return null;
});

export const findAndUpdateProjectUser = (project_id: any, dynamicFields: any) => {
    return ProjectUser.findOneAndUpdate(
        { project_id },
        { $push: { users_mapping: dynamicFields } },
        { new: true, runValidators: true }
    );
};

export const findAndUpdateInArray = (user_id: any, role_id: any) => ProjectUser.updateOne(
    { 'users_mapping.user_id': user_id }, { $set: { 'users_mapping.$.role_id': role_id } }
)

export const removeAndupdate = (project_id: string, user_id: string) => ProjectUser.updateOne(
    { project_id },
    { $pull: { users_mapping: { user_id: user_id } } },
);

export const findAndUpdateRoleProjectUser = (dynamicFields: any, project_id: any) => ProjectUser.updateOne(
    { project_id, 'users_mapping.user_id': dynamicFields.user_id },
    { $set: { 'users_mapping.$': dynamicFields } }
);

export const insertMany = (values: Record<string, any>) => ProjectUser.insertMany(values);

export const updateMany = (filter: any, values: Record<string, any>) => ProjectUser.updateMany(filter, values);

export const projectBulkWrite = (values: any) => ProjectUser.bulkWrite(values);

/**
 * Find all by dynamic fields 
 */
export const findAllByProjectUserMapFields = (dynamicFields: Record<string, any>) => ProjectUser.find(dynamicFields).then((projectUser) => {
    if (!projectUser) {
        return null;
    }
    return projectUser;
}).catch((error: any) => {
    return null;
});
