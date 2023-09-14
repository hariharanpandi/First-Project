import mongoose, { Document, Schema } from "mongoose";
import AppConstants from "../utils/constant";

const appConstant = new AppConstants();
interface IApplication extends Document {
    tenant_id: string,
    tenant_group_id: string,
    project_id: string,
    app_name: string,
    description: string,
    app_img: string,
    blob_Name: string,
    status: 'Active' | 'Inactive',
    created_by_user_id: string,
    created_at: Date,
    updated_by_user_id: string,
    updated_at: Date
}

const applicationSchema: Schema<IApplication> = new mongoose.Schema({
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
        required: true,
        index: true
    },
    app_name: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 50,
        index: true
    },
    description: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 360
    },
    app_img: {
        type: String,
        default:null
    },
    blob_Name: {
        type: String
    },
    status: {
        type: String,
        enum: [appConstant.SCHEMA.STATUS_ACTIVE, appConstant.SCHEMA.STATUS_INACTIVE],
        default: 'Active'
    },
    created_by_user_id: {
        type: String,
        required: true,
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
    },
}, { collection: appConstant.SCHEMA.APP_COLLECTION_NAME });

applicationSchema.index({ _id: 1, app_name: 1 }); 

/**
 * Create project
 */
export const applicationCreate = (values: Record<string, any>) => new Application(values).save().then((application) => application.toObject());

/**
 * Update by _id 
 */
export const updateApplication = (_id: string, dynamicFields: Record<string, any>) => Application.findByIdAndUpdate(_id, dynamicFields, { new: true, runValidators: true });

/**
 * Soft delete by _id, and update fields data  
 */
export const deleteApplication = (_id: string, dynamicFields: Record<string, any>) => Application.findByIdAndUpdate(_id, dynamicFields);

/**
 * Find all with condition
 */
export const findAllApplication = (dynamicFields: Record<string, any>) => Application.find(dynamicFields);

/**
 * Find by dynamic fields 
 */
export const findByApplicationFields = (dynamicFields: Record<string, any>) => Application.findOne(dynamicFields).then((application) => {
    if (!application) {
        return null;
    }
    return application;
}).catch((error: any) => {
    return null;
});

/**
 * Ignore cases when finding by project name
 */
export const findByApplicationName = (app_name: string, project_id: string) => {
    const ignoreCases = new RegExp(`^${app_name}$`, 'i');
    return Application.findOne({ app_name: { $regex: ignoreCases }, project_id, status: appConstant.SCHEMA.STATUS_ACTIVE }).then((application) => {
        if (!application) {
            return null;
        }
        return application;
    }).catch((error: any) => {
        return null;
    });
};


const Application = mongoose.model<IApplication>('Application', applicationSchema);

export { Application, applicationSchema };