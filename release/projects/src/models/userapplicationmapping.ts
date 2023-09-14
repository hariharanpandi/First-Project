import mongoose, { Document, Schema } from "mongoose";
import AppConstants from "../utils/constant";

const appConstant = new AppConstants();

interface IUserMapping {
    user_id: string[];
    application_id: string;
}

interface IApplicationUser extends Document {
    tenant_id: string,
    tenant_group_id: string,
    project_id: string,
    project_user_map_id: string,
    application: IUserMapping[],
    status: string,
    created_by_user_id: string,
    created_at: Date,
    updated_by_user_id: string,
    updated_at: Date,
}

const applicationUserSchema: Schema<IApplicationUser> = new mongoose.Schema({
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
    project_user_map_id: {
        type: String,
    },
    application: [
        {
            _id: false,
            user_id: {
                type: [String],
                required: true,
                index: true
            },
            application_id: {
                type: String,
                required: true,
                index: true
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
        type: Date
    },
}, { collection: appConstant.SCHEMA.APPLICATION_MAP });

export const ApplicationUser = mongoose.model<IApplicationUser>('ApplicationUser', applicationUserSchema);

export const applicationUserCreate = (values: any) => new ApplicationUser(values).save().then((applicationUserMap) => applicationUserMap.toObject());

/**
 * Find by dynamic fields 
 */
export const findByApplicationUserMapFields = (dynamicFields: Record<string, any>) => ApplicationUser.findOne(dynamicFields).then((applicationUser) => {
    if (!applicationUser) {
        return null;
    }
    return applicationUser;
}).catch((error: any) => {
    return null;
});

export const isUserExist = (dynamicFields: Record<string, any>) => ApplicationUser.findOne({
    project_id: dynamicFields.project_id,
    application: {
        $elemMatch: {
            application_id: dynamicFields.application_id,
            user_id: { $all: [dynamicFields.user_id] }
        }
    }
});



export const findAndUpdateApplicationUser = (project_id: any, application_id: string, dynamicFields: any) => {
    const result = ApplicationUser.findOneAndUpdate(
        { project_id, "application.application_id": application_id },
        { $push: { "application.$.user_id": dynamicFields } },
        { new: true, runValidators: true }
    );
    return result;
};

export const findAndUpdateAppNewUser = (project_id: any, dynamicFields: any) => {
    return ApplicationUser.findOneAndUpdate(
        { project_id },
        { $push: { application: dynamicFields } },
        { new: true, runValidators: true }
    );
};

export const removeAndupdateApplication = (project_id: string, user_id: string, application_id: string) => ApplicationUser.updateOne(
    {
        project_id,
        'application.application_id': application_id
    },
    { $pull: { 'application.$.user_id': user_id } }
);

/**
* Application user list
*/
export const getAppUsers=(dynamicFields:Record<string,any>)=>ApplicationUser.findOne(dynamicFields,{ 'application.$': 1 });