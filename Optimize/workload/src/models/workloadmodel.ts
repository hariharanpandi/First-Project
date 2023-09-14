import mongoose, { Document, Schema } from "mongoose";
import AppConstants from "../utils/constant";
import { filter } from "lodash";

const appConstant = new AppConstants();

interface INode {
    id: string;
    resource_id: string;
    resource_group_id?: string;
    name: string;
    label: string;
    cid: string;
    lookup_collection: string;
    x: string,
    y: string,
}

interface IEdge {
    resource_from: string;
    resource_to: string;
    from: string;
    to: string;
    id: string;
}

interface IWorkload extends Document {
    tenant_id: string,
    tenant_group_id: string,
    project_id: string,
    app_id: string,
    workload_name: string,
    nodes: INode[],
    edges: IEdge[],
    cloud_platform: string,
    discover_sync_flag: Boolean,
    last_discovered_on: Date,
    status: 'Active' | 'Inactive',
    created_by_user_id: string,
    created_at: Date,
    updated_by_user_id: string,
    updated_at: Date
}

const workloadSchema = new mongoose.Schema({
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
        required: true
    },
    app_id: {
        type: String,
        required: true
    },
    workload_name: {
        type: String,
        required: true
    },
    nodes: [{
        _id: false,
        id: {
            type: String,
            required: true
        },
        resource_id: {
            type: String,
            required: true
        },
        resource_group_id: {
            type: String
        },
        name: {
            type: String,
            required: true
        },
        label: {
            type: String,
            required: true
        },
        cid: {
            type: String
        },
        lookup_collection: {
            type: String
        },
        x: {
            type: String
        },
        y: {
            type: String
        },

    }],
    edges: [{
        _id: false,
        resource_from: {
            type: String,
            required: true
        },
        resource_to: {
            type: String,
            required: true
        },
        from: {
            type: String,
            required: true
        },
        to: {
            type: String,
            required: true
        },
        id: {
            type: String,
            required: true
        }
    }],
    cloud_platform: {
        type: String,
    },
    discover_sync_flag: {
        type: Boolean,
        default: false
    },
    last_discovered_on: {
        type: Date
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
        type: String
    },
    updated_at: {
        type: Date
    },
}, { collection: appConstant.SCHEMA.WORKLOAD_COLLECTION });

workloadSchema.index({ _id: 1, workload_name: 1 }); 
/**
 * Create project
 */
export const workloadCreate = (values: Record<string, any>) => Workload.create(values);

/**
 * Update by _id 
 */
export const updateWorkload = (_id: string, dynamicFields: Record<string, any>) => Workload.findByIdAndUpdate(_id, dynamicFields, { new: true, runValidators: true });

/**
 * Soft delete by _id, and update fields data  
 */
export const deleteWorkload = (_id: string, dynamicFields: Record<string, any>) => Workload.findByIdAndUpdate(_id, dynamicFields);

/**
 * Find all with condition
 */
export const findAllWorkload = (dynamicFields: Record<string, any>) => Workload.find(dynamicFields);

/**
 * Find by dynamic fields 
 */
export const findByWorkloadFields = (dynamicFields: Record<string, any>) => Workload.findOne(dynamicFields).then((application) => {
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
export const findByWorkloadName = (workload_name: string, app_id: string) => {
    const ignoreCases = new RegExp(`^${workload_name}$`, 'i');
    return Workload.findOne({ workload_name: { $regex: ignoreCases }, app_id, status: appConstant.SCHEMA.STATUS_ACTIVE }).then((workload) => {
        if (!workload) {
            return null;
        }
        return workload;
    }).catch((error: any) => {
        return null;
    });
};

export const findByArrayOfValue = (primaryIds: any, tenant_id: any) => Workload.find({ 'nodes.resource_id': { $in: primaryIds }, tenant_id: tenant_id });

export const discoverSyncUpdateMany = (filter: Record<string, any>, update: Record<string, any>) => Workload.updateMany(filter, update);

const Workload = mongoose.model('Workload', workloadSchema);

export { Workload, workloadSchema };