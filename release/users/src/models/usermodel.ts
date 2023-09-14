import AppConstants from "../utils/constant";
import jwt from "jsonwebtoken";
const mongoose = require('mongoose');

const appConstant = new AppConstants();

const ownerSchema = new mongoose.Schema({
    _id: {
        type: String,
        default: () => new mongoose.Types.ObjectId().toString('hex'),
    },
    _cls: {
        type: String,
        enum: ['Owner.User', 'Owner.Organization'],
        required: true,
        index: true
    },
    alerts_email: {
        type: [String],
        default: []
    },
    avatar: {
        type: String,
        default: ''
    },
    beta_access: {
        type: Boolean,
        default: true,
        required: ['Owner.User', 'beta_access']
    },
    can_create_org: {
        type: Boolean,
        default: true,
        required: ['Owner.User', 'can_create_org']
    },
    clouds_count: {
        type: Number,
        default: 0,
        required: function (this: { _cls: string }): boolean {
            return this._cls === 'Owner.Organization' ? true : false;
        }
    },
    created: {
        type: Date,
        default: Date.now,
        alias: 'created_at'
    },
    email: {
        type: String,
        required: ['Owner.User', 'email'],
        index: true
    },
    enable_r12ns: {
        type: Boolean,
        default: false,
        required: function (this: { _cls: string }): boolean {
            return this._cls === 'Owner.Organization' ? true : false;
        }
    },
    feedback: {
        type: Object,
        default: {},
        required: ['Owner.User', 'feedback']
    },
    first_name: {
        type: String,
        required: ['Owner.User', 'first_name']
    },
    ips: {
        type: [String],
        default: [],
        required: ['Owner.User', 'ips']
    },
    last_active: {
        type: Date
    },
    last_name: {
        type: String
    },
    members: {
        type: [String],
        default: [],
        required: function (this: { _cls: string }): boolean {
            return this._cls === 'Owner.Organization' ? true : false;
        }
    },
    members_count: {
        type: Number,
        default: 0,
        required: function (this: { _cls: string }): boolean {
            return this._cls === 'Owner.Organization' ? true : false;
        }
    },
    name: {
        type: String,
        required: function (this: { _cls: string }): boolean {
            return this._cls === 'Owner.Organization' ? true : false;
        },
        alias: 'project_name'
    },
    username: {
        type: String
    },
    ownership_enabled: {
        type: Boolean,
        default: false,
        required: function (this: { _cls: string }): boolean {
            return this._cls === 'Owner.Organization' ? true : false;
        }
    },
    password: {
        type: String
    },
    role: {
        type: String,
        default: 'admin',
        required: ['Owner.User', 'role']
    },
    rule_counter: {
        type: Number,
        default: 0
    },
    status: {
        type: String,
        default: function (this: { _cls: string }): string {
            return this._cls === 'Owner.User' ? 'confirmed' : 'Active';
        },
        required: true,
        index: true
    },
    super_org: {
        type: Boolean,
        default: false,
        required: function (this: { _cls: string }): boolean {
            return this._cls === 'Owner.Organization' ? true : false;
        }
    },
    teams_count: {
        type: Number,
        default: 0,
        required: function (this: { _cls: string }): boolean {
            return this._cls === 'Owner.Organization' ? true : false;
        }
    },
    total_machine_count: {
        type: Number,
        default: 0
    },
    teams: {
        type: [String],
        default: [],
        required: function (this: { _cls: string }): boolean {
            return this._cls === 'Owner.Organization' ? true : false;
        }
    },
    tenant_id: {
        type: String,
        required: true,
        index: true
    },
    tenant_group_id: {
        type: String,
        required: true,
        index: true
    },
    description: {
        type: String,
        required: function (this: { _cls: string }): boolean {
            return this._cls === 'Owner.Organization' ? true : false;
        }
    },
    user_type: {
        type: String,
        default: 'N',
        required: ['Owner.User', 'user_type'],
        index: true
    },
    login_type: {
        type: String,
        default: 'Basic',
        required: ['Owner.User', 'login_type']
    },
    last_login_at: {
        type: Date,
        default:null
    },
    user_img: {
        type: String,
        default: null
    },
    forget_pwd: {
        type: String
    },
    blob_Name: {
        type: String,
    },
    pwd_expiration_time: {
        type: Date
    },
    last_pwd_changed_at: {
        type: Date,
        default: null
    },
    created_by_user_id: {
        type: String
    },
    updated_by_user_id: {
        type: String
    },
    updated_at: {
        type: Date,
        required: function (this: { _cls: string }): boolean {
            return this._cls === 'Owner.Organization' ? true : false;
        }
    }
}, { collection: appConstant.SCHEMA.OWNER_COLLECTION }); 

ownerSchema.index({ _cls: 1, tenant_id: 1, status: 1 });

ownerSchema.index({ _cls: 1, _id: 1 });

// Model definition
const User = mongoose.model('User', ownerSchema);

export { User, ownerSchema };

/**
 * Generate auth token
 */
export const generateAuthToken = (userData: Record<string, any>, tenant: Record<string, any>) => jwt.sign(
    {
        _id: userData._id,
        first_name: userData.first_name,
        last_name: userData.last_name,
        email: userData.email,
        tenant_id: userData.tenant_id,
        user_type: userData.user_type,
        tenant_group_id: userData.tenant_group_id,
        time_zone: tenant.time_zone,
        isAdmin: userData.isAdmin ? userData.isAdmin : false,
    },
    `${process.env.SECRET_KEY}`
);

/**
 * Find by id
 */
export const findByUserId = (_cls: string, _id: string) => User.findOne({ _cls, _id }).then((teantuser: any) => {
    if (!teantuser) {
        return null;
    }
    return teantuser;
}).catch((error: any) => {
    return null;
});

/**
 * Find  by dynamic fields
 */
export const findByUserFields = (dynamicFields: Record<string, any>) => {
    return User.findOne(dynamicFields);
};

/**
 * User create
 */
export const userCreate = (values: Record<string, any>) => new User(values).save().then((user: any) => user.toObject());

/**
 * Get all user
 */
export const findAll = (dynamicfileds: Record<string, any>) => User.find(dynamicfileds);

/**
 * User Update
 */
export const updateUserByid = (_cls: string, _id: string, dynamicfileds: object) =>
    User.findOneAndUpdate({ _cls, _id }, { $set: dynamicfileds }, { new: true }).then((tenantResponse: any) => {
        if (!tenantResponse) {
            return null;
        }
        return tenantResponse;
    }).catch((error: any) => {
        return null;
    });

export const userCount = (dynamicFields: Record<string, any>) => User.countDocuments(dynamicFields);
