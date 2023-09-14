import mongoose, { Document, Schema } from "mongoose";
import AppConstants from "../utils/constant";

const appConstant = new AppConstants();

interface ICloudResourceGroup {
  _id: string; // Explicitly defining _id as a string
  name: string;
  image: string;
  lookupkeys: ILookupKeys;
  lookup_collection: string;
  status: 'Active' | 'Inactive';
}

interface ILookupKeys {
  notify_field: string;
  resource_id: string;
  resource_name: string;
}

interface IWorkloadResourceGrouping extends Document {
  _id: string;
  cloud_platform_type: string;
  cloud_category: string;
  cloud_category_status: 'Active' | 'Inactive';
  cloud_resource_grp: ICloudResourceGroup[];
  created_by: string;
  created_at: Date;
  updated_by: string;
  updated_at: Date;
}

const cloudResourceGroupSchema: Schema<ICloudResourceGroup> = new mongoose.Schema({
  _id: {
    type: String,
    default: () => new mongoose.Types.ObjectId().toString(), // You can remove the 'hex' argument to get a regular string
  },
  name: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  lookup_collection: {
    type: String,
    required: true,
  },
  lookupkeys: {
    type: new mongoose.Schema({
      notify_field: String,
      resource_id: String,
      resource_name: String,
    }, { _id: false } )
  },
  status: {
    type: String,
    enum: ['Active', 'Inactive'],
    default: 'Active',
  },
});

const WorkloadResourcegroupingSchema: Schema<IWorkloadResourceGrouping> = new mongoose.Schema({
  _id: {
    type: String,
    default: () => new mongoose.Types.ObjectId().toString('hex'),
  },
  cloud_platform_type: {
    type: String,
    enum: ['Aws', 'Azure'],
  },
  cloud_category: {
    type: String,
  },
  cloud_category_status: {
    type: String,
    enum: ['Active', 'Inactive'],
    default: 'Active',
  },
  cloud_resource_grp: {
    type: [cloudResourceGroupSchema],
    required: true,
  },
  created_by: {
    type: String,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  updated_by: {
    type: String,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
}, { collection: appConstant.SCHEMA.WORKLOAD_RESOURCE_GROUPING });

const WorkloadResourcegrouping = mongoose.model<IWorkloadResourceGrouping>('WorkloadResourcegrouping', WorkloadResourcegroupingSchema);

/**
 * Create workload
 */
export const workloadResourceGroupingMasterCreate = (values: Record<string, any>) => new WorkloadResourcegrouping(values).save().then((workload) => workload.toObject());

/**
 * Find all with condition
 */
export const findAll = (dynamicFields: Record<string, any>) => WorkloadResourcegrouping.find(dynamicFields);

/**
 * Find the record based on the reource grp id
 */
export const findByResourceGrp = (_id: string) => WorkloadResourcegrouping.findOne({
  'cloud_resource_grp._id': _id
});
/**
 * Find one ResourceGroup with id
 */
export const GetWorkloadResourceById = (_id: any) => WorkloadResourcegrouping.findOne(_id);

/**
 * Find all resource group
 */
export const GetAllWorkloadResource = (keys: any) => WorkloadResourcegrouping.find(keys);

export { WorkloadResourcegrouping, WorkloadResourcegroupingSchema };
