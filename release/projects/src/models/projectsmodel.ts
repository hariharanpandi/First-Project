import AppConstants from "../utils/constant";
const mongoose = require('mongoose');

const appConstant = new AppConstants();

const ownerSchema = new mongoose.Schema({
    _id: {
        type: String,
        default: () => new mongoose.Types.ObjectId().toString('hex')
    },
    _cls: {
        type: String,
        enum: ['Owner.User', 'Owner.Organization'],
        required: true
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
        required: function (this: { _cls: string }): boolean {
            return this._cls === 'Owner.User' ? true : false;
        }
    },
    can_create_org: {
        type: Boolean,
        default: true,
        required: function (this: { _cls: string }): boolean {
            return this._cls === 'Owner.User' ? true : false;
        }
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
        required: function (this: { _cls: string }): boolean {
            return this._cls === 'Owner.User' ? true : false;
        }
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
        required: function (this: { _cls: string }): boolean {
            return this._cls === 'Owner.User' ? true : false;
        }
    },
    first_name: {
        type: String,
        required: function (this: { _cls: string }): boolean {
            return this._cls === 'Owner.User' ? true : false;
        }
    },
    ips: {
        type: [String],
        default: [],
        required: function (this: { _cls: string }): boolean {
            return this._cls === 'Owner.User' ? true : false;
        }
    },
    last_active: {
        type: Date
    },
    last_name: {
        type: String,
        required: function (this: { _cls: string }): boolean {
            return this._cls === 'Owner.User' ? true : false;
        }
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
        alias: 'project_name',
        index: true
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
        required: function (this: { _cls: string }): boolean {
            return this._cls === 'Owner.User' ? true : false;
        }
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
        required: true
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
        required: true
    },
    tenant_group_id: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: function (this: { _cls: string }): boolean {
            return this._cls === 'Owner.Organization' ? true : false;
        }
    },
    login_type: {
        type: String,
        required: function (this: { _cls: string }): boolean {
            return this._cls === 'Owner.User' ? true : false;
        }
    },
    last_login_at: {
        type: Date
    },
    user_img: {
        type: String
    },
    forget_pwd: {
        type: String
    },
    pwd_expiration_time: {
        type: Date,
        required: function (this: { _cls: string }): boolean {
            return this._cls === 'Owner.User' ? true : false;
        }
    },
    last_pwd_changed_at: {
        type: Date
    },
    created_by_user_id: {
        type: String,
        required: true
    },
    updated_by_user_id: {
        type: String,
        required: function (this: { _cls: string }): boolean {
            return this._cls === 'Owner.Organization' ? true : false;
        }
    },
    updated_at: {
        type: Date,
        default: Date.now,
        required: function (this: { _cls: string }): boolean {
            return this._cls === 'Owner.Organization' ? true : false;
        }
    }
}, { collection: appConstant.SCHEMA.OWNER_COLLECTION });


/**
 * Create project
 */
export const projectsCreate = (values: Record<string, any>) => new Project(values).save().then((project: { toObject: () => any; }) => project.toObject());
/**
 * Update by _id 
 */
export const updateProject = (_cls: any, _id: string, dynamicFields: Record<string, any>) => Project.findByIdAndUpdate(_id, dynamicFields, { new: true, runValidators: true });
/**
 * Soft delete by _id, and update fields data  
 */
export const deleteProject = (_cls: any, _id: string, dynamicFields: Record<string, any>) => Project.findByIdAndUpdate(_id, dynamicFields);
/**
 * Find all with condition
 */
export const findAllProjects = (dynamicFields: Record<string, any>) => Project.find(dynamicFields);
/**
 * Find by dynamic fields 
 */
export const findByProjectFields = (dynamicFields: Record<string, any>) => Project.findOne(dynamicFields).then((project: any) => {
    if (!project) {
        return null;
    }
    return project;
}).catch((error: any) => {
    return null;
});
/**
 * Ignore cases when finding by project name
 */
export const findByProjectName = (_cls: string, project_name: string, tenant_id: string) => {
    const ignoreCases = new RegExp(`^${project_name}$`, 'i');
    return Project.findOne({ _cls, name: { $regex: ignoreCases }, tenant_id, status: appConstant.SCHEMA.STATUS_ACTIVE }).then((project: any) => {
        if (!project) {
            return null;
        }
        return project;
    }).catch((error: any) => {
        return null;
    });
};
const Project = mongoose.model('Project', ownerSchema);

export { Project, ownerSchema };