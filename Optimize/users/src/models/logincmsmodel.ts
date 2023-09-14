import mongoose, { Document, Schema } from "mongoose";
import AppConstants from "../utils/constant";
import { ObjectId } from "mongodb";

const appConstant = new AppConstants();

interface ILoginCms extends Document {
    tenant_id: string,
    page_title: string,
    page_description: string,
    page_url: string,
    status: 'Active' | 'Inactive',
    created_by_user_id: string,
    created_at: Date,
    updated_by_user_id: string,
    updated_at: Date
}

const loginCmsSchema: Schema<ILoginCms> = new Schema({
    _id: {
        type: String,
        default: () => new mongoose.Types.ObjectId().toString('hex'),
    },
    tenant_id: {
        type: String,
        required: true,
    },
    page_title: {
        type: String,
        required: true,
        minlength: 5,
    },
    page_description: {
        type: String,
        required: true,
    },
    page_url: {
        type: String,
        required: true,
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
    }
}, { collection: appConstant.SCHEMA.LOGIN_CMS_COLLECTION });

const LoginCms = mongoose.model<ILoginCms>('LoginCms', loginCmsSchema);
export { LoginCms, loginCmsSchema };

/**
 * Find Terms-of-service or Privacy-policy by page_url
 */
export const findByLoginCmsFields = (dynamicFields: Record<string, any>) => LoginCms.findOne(dynamicFields).then((data) => {
    if (!data) {
        return null;
    }
    return data;
}).catch((error: any) => {
    return null;
});