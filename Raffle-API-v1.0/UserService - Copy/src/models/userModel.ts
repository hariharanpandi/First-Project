import mongoose, { Document } from "mongoose";
import jwt from "jsonwebtoken";

import { STATUS, COLLECTION_NAMES } from "../utils/appConstant";

interface Identity {
    _id: string;
    type: string;
    value: string;
}

interface Address {
    _id: string;
    name: string;
    type: string;
    addressLine: string;
    city: string;
    district: string;
    state: string;
    country: string;
    postalCode: string;
    status: string;
    createdBy: string;
    createdAt: Date;
    updatedBy?: string;
    updatedAt?: Date;
}

interface PaymentMethod {
    _id: string;
    type: string;
    cardName: string;
    cardNumber: number;
    expiryDate: string;
    code: number;
    status: string;
    createdBy: string;
    createdAt: Date;
    updatedBy?: string;
    updatedAt?: Date;
}

interface Settings {
    timeZone: string;
    preferredLanguage: string;
}

interface UserDocument extends Document {
    _id: string;
    name: string;
    role: string;
    email: string;
    mobile: string;
    alternativeEmail?: string;
    alternativeMobile?: string;
    identity: Identity[];
    address: Address[];
    paymentMethod: PaymentMethod[];
    settings: Settings;
    status: string;
    createdAt: Date;
    updatedBy?: string;
    updatedAt?: Date;
}
const userSchema = new mongoose.Schema({
    _id: {
        type: String,
        default: () => new mongoose.Types.ObjectId().toString("hex")
    },
    name: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        require: true
    },
    email: {
        type: String,
        required: true,
    },
    mobile: {
        type: String,
        required: true
    },
    alternativeEmail: {
        type: String
    },
    alternativeMobile: {
        type: String
    },
    identity: [
        {
            _id: {
                type: String,
                default: () => new mongoose.Types.ObjectId().toString("hex")
            },
            type: {
                type: String,
                required: true,
            },
            value: {
                type: String,
                required: true,
            }
        }
    ],
    address: [
        {
            _id: {
                type: String,
                default: () => new mongoose.Types.ObjectId().toString("hex")
            },
            name: {
                type: String,
                required: true,
            },
            type: {
                type: String,
                required: true,
            },
            addressLine: {
                type: String,
                required: true,
            },
            city: {
                type: String,
                required: true,
            },
            district: {
                type: String,
                required: true,
            },
            state: {
                type: String,
                required: true,
            },
            country: {
                type: String,
                required: true,
            },
            postalCode: {
                type: String,
                required: true,
            },
            status: {
                type: String,
                enum: [STATUS.ACTIVE, STATUS.INACTIVE],
                default: "active",
            },
            createdBy: {
                type: String,
                required: true
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
    paymentMethod: [
        {
            _id: {
                type: String,
                default: () => new mongoose.Types.ObjectId().toString("hex")
            },
            type: {
                type: String,
                required: true,
            },
            cardName: {
                type: String,
                required: true,
            },
            cardNumber: {
                type: Number,
                required: true,
            },
            expiryDate: {
                type: String,
                required: true,
            },
            code: {
                type: Number,
                required: true,
            },
            status: {
                type: String,
                enum: [STATUS.ACTIVE, STATUS.INACTIVE],
                default: "active",
            },
            createdBy: {
                type: String,
                required: true
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
    settings: {
        timeZone: {
            type: String,
            required: true,
        },
        preferredLanguage: {
            type: String,
            required: true,
        }
    },
    status: {
        type: String,
        enum: [STATUS.ACTIVE, STATUS.INACTIVE, STATUS.PENDING],
        default: "pending",
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
}, { collection: COLLECTION_NAMES.USER });

export const User = mongoose.model<UserDocument>("User", userSchema);

export const generateAuthToken = (userData: Partial<UserDocument>) => jwt.sign(
    {
        _id: userData?._id,
        name: userData?.name,
        email: userData?.email,
        mobile: userData?.mobile,
        role: userData?.role,
        time_zone: userData?.settings?.timeZone,
    },
    `${process.env["SECRET_KEY"]}`
);

export const createUser = (values: Partial<UserDocument>) => new User(values).save().then(user => user.toObject());

export const findOneUser = (dynamicFields: Record<string, unknown>) => User.findOne(dynamicFields);

export const findByIdAndUpdateUser = (_id: string, updatedValue: Record<string, unknown>) => User.findByIdAndUpdate(_id, updatedValue, { new: true });