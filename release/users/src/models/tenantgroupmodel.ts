import mongoose, { Document, Schema } from "mongoose";
import AppConstants from "../utils/constant";
import { ObjectId } from "mongodb";

const appConstant = new AppConstants();

interface ITenantGroup extends Document {
    tenant_map: string[],
    tenant_domain: String,
    status: 'Active' | 'Inactive',
    created_by_user_id: string,
    created_at: Date,
    updated_at: Date
}

const tenantSchema: Schema<ITenantGroup> = new Schema({
    _id: {
        type: String,
        default: () => new mongoose.Types.ObjectId().toString('hex'),
    },
    tenant_map: {
        type: [Schema.Types.String],
        required: true,
        unique: true,
        minlength: 1,
        maxlength: 50
    },
    tenant_domain: {
        type: String,
        required: true,
        unique: true,
        minlength: 1,
        maxlength: 50,
        index: true
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
    }
}, { collection: appConstant.SCHEMA.TENANT_GROUP_COLLECTION });

const TenantGroup = mongoose.model<ITenantGroup>('TenantGroup', tenantSchema);
export { TenantGroup, tenantSchema };

/**
 * Tenant tenant_group
 */
export const tenantGroupCreate = (values: Record<string, any>) => new TenantGroup(values).save().then((tenantgroup) => tenantgroup.toObject());

export const pushTenantId = (tenantDomain: any, tenantId: any) => TenantGroup.updateOne({ tenant_domain: tenantDomain },
    { $push: { tenant_map: tenantId } })

export const findByGrpFields = (dynamicFields: Record<string, any>) => {
    return TenantGroup.findOne(dynamicFields);
};

export const tenantGrpMatch = (objectId: any) => TenantGroup.find({ "tenant_map": { "$elemMatch": { "$eq": objectId } } });
