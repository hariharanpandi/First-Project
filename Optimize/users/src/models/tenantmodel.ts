import { ObjectId } from "mongodb";
import mongoose, { Document, Schema } from "mongoose";
import AppConstants from "../utils/constant";

const appConstant = new AppConstants();

interface ITenant extends Document {
    org_name: string,
    org_img: string,
    domain_name: string,
    contact_name: string,
    email: string,
    contact_info: string,
    onboard_on: Date,
    offboard_on: Date,
    sso_enabled: 'Y' | 'N',
    status: 'confirmed' | 'deleted',
    created_by_user_id: string,
    created_at: Date,
    updated_at: Date,
    expiry_on: Date,
    time_zone: string,
}

const tenantSchema: Schema<ITenant> = new Schema({
    _id: {
        type: String,
        default: () => new mongoose.Types.ObjectId().toString('hex'),
    },
    org_name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
    },
    org_img: {
        type: String
    },
    domain_name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50,
        index: true
    },
    contact_name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
    },
    email: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 255,
        index: true
    },
    contact_info: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 255
    },
    onboard_on: {
        type: Date,
        default: Date.now
    },
    offboard_on: {
        type: Date,
        default: null
    },
    time_zone: {
        type: String,
        required: true
    },
    sso_enabled: {
        type: String,
        enum: [appConstant.SCHEMA.ISACTIVE, appConstant.SCHEMA.ISINACTIVE],
        default: 'N'
    },
    status: {
        type: String,
        enum: [appConstant.USER_STATUS.STATUS_CONFIRMED, appConstant.USER_STATUS.STATUS_PENDING],
        default: 'confirmed'
    },
    created_by_user_id: {
        type: String,
        minlength: 5,
        maxlength: 50
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    updated_at: {
        type: Date
    },
    expiry_on: {
        type: Date,
        default: Date.now
    }
}, { collection: appConstant.SCHEMA.TENANT_COLLECTION_NAME });

const Tenant = mongoose.model<ITenant>('Tenant', tenantSchema);
export { Tenant, tenantSchema };

/**
 * Tenant create
 */
export const tenantCreate = (values: Record<string, any>) => new Tenant(values).save().then((tenant) => tenant.toObject());

/**
 * Update tenant created_by_user_id
 */
export const updateTenantCreateUserId = (_id: string, userid: string) =>
    Tenant.findOneAndUpdate({ _id: _id }, { $set: { created_by_user_id: userid } }, { new: true }).then((tenantResponse) => {
        if (!tenantResponse) {
            return null;
        }
        return tenantResponse;
    }).catch((error) => {
        return null;
    });

/**
* Update tenant email
*/
export const updateTenantById = (_id: string, dynamicfileds: object) =>
    Tenant.updateOne({ _id: _id }, { $set: dynamicfileds }, { new: true }).then((tenantResponse) => {
        if (!tenantResponse) {
            return null;
        }
        return tenantResponse;
    }).catch((error) => {
        return null;
    });


/**
 * Find tenant by _id
 */
export const findByTenantId = (_id: string) => Tenant.findOne({ _id }).then((tenant) => {
    if (!tenant) {
        return null;
    }
    return tenant;
}).catch((error) => {
    return null;
});


/**
 * Find by field dynamically
 */
export const findByField = (dynamicFields: Record<string, any>) => {
    return Tenant.findOne(dynamicFields);
};

