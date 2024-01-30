import mongoose, { Document, FilterQuery, Schema } from "mongoose";

import { STATUS, COLLECTION_NAMES } from "../utils/appConstant";
import { DynamicFields } from "../utils/customTypes";


interface Password {
    _id: string;
    value: string;
    expiryDate: Date;
    status: string;
    createdAt: Date;
    updatedBy?: string;
    updatedAt?: Date;
}

interface Token {
    accessToken: string;
    expiryDate: Date;
}

interface TwoFactorAuth {
    mobile: {
        OTP: string;
        expiryDate: Date;
    };
    email: {
        OTP: string;
        expiryDate: Date;
    };
}

interface IdentityDocument extends Document {
    _id: string;
    userId: string;
    password: Password[];
    token: Token;
    "2factorAuth": TwoFactorAuth;
}

const identitySchema: Schema<IdentityDocument> = new mongoose.Schema({
    _id: {
        type: String,
        default: () => new mongoose.Types.ObjectId().toString("hex")
    },
    userId: {
        type: String,
        required: true,
    },
    password: [
        {
            _id: {
                type: String,
                default: () => new mongoose.Types.ObjectId().toString("hex")
            },
            value: {
                type: String,
                required: true
            },
            expiryDate: {
                type: Date,
                default: () => getDateAfterDays(60)
            },
            status: {
                type: String,
                enum: [STATUS.ACTIVE, STATUS.INACTIVE],
                default: "active",
            },
            createdAt: {
                type: Date,
                default: Date.now
            },
            updatedBy: {
                type: String
            },
            updatedAt: {
                type: Date
            }
        }
    ],
    token: {
        accessToken: {
            type: String,
        },
        expiryDate: {
            type: Date,
        }
    },
    "2factorAuth": {
        mobile: {
            OTP: {
                type: String,
            },
            expiryDate: {
                type: Date,
            }
        },
        email: {
            OTP: {
                type: String,
            },
            expiryDate: {
                type: Date,
            }
        }
    }
}, { collection: COLLECTION_NAMES.IDENTITY });

function getDateAfterDays(days: number) {
    const date = new Date();
    date.setDate(date.getDate() + days);
    return date;
}

export const Identity = mongoose.model<IdentityDocument>("Identity", identitySchema);

export const createIdentity = (values: Record<string, any>) => new Identity(values).save().then(identity => identity.toObject());

export const findOneIdentity = (dynamicFields: DynamicFields) => Identity.findOne(dynamicFields);

export const findOneAndUpdateIdentity = (filter: FilterQuery<IdentityDocument>, updatedValues: Partial<IdentityDocument>) => Identity.findOneAndUpdate(filter, updatedValues, { new: true });