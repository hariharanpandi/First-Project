import mongoose, { Document, Schema } from "mongoose";
import AppConstants from "../utils/constant";
import { ObjectId } from "mongodb";

const appConstant = new AppConstants();

interface ILoginToken extends Document {
    _id: string,
    tenant_id: string,
    tenant_group_id: string,
    user_id: string,
    email: string,
    token: string,
    created_at: Date
}

const loginTokenSchema: Schema<ILoginToken> = new Schema({
    _id: {
        type: String,
        default: () => new mongoose.Types.ObjectId().toString('hex'),
    },
    tenant_id: {
        type: String,
        required: true,
    },
    tenant_group_id: {
        type: String,
        required: true,
    },
    user_id: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    token: {
        type: String,
        required: true,
    },
    created_at: {
        type: Date,
        default: Date.now,
    }
}, { collection: appConstant.SCHEMA.AUTH_TOKEN });

const LoginToken = mongoose.model<ILoginToken>('LoginToken', loginTokenSchema);
export { LoginToken, loginTokenSchema };

/**
 * Find by email
 */
export const findAuthByAuthTokenFields = (dynamicFields: Record<string, any>) => LoginToken.findOne(dynamicFields);
