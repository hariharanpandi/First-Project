import mongoose, { Document, Schema } from 'mongoose';
import AppConstants from "../utils/constant";
import { ObjectId } from "mongodb";

const appConstant = new AppConstants();

interface ICloudOnbarod extends Document {
  _cls: string,
  apikey: string,
  apisecret: string,
  cluster_count: number,
  container_enabled: boolean,
  created_by: string,
  dns_enabled: boolean,
  enabled: boolean,
  key: string,
  machine_count: number,
  object_storage_enabled: boolean,
  observation_logs_enabled: boolean,
  owned_by: string,
  owner: string,
  polling_interval: number,
  region: string,
  secret: string,
  starred: string[],
  subscription_id: string,
  tenant_id: string,
  title: string,
  unstarred: string[];
  account_type: string,
  access_type: string,
  environment: string,
  authentication_protocol: string,
  bucket_name: string,
  cost_report_format_fields: string,
  opted_regions: string[],
  discovery_date: Date,
  application_id: string,
  subscription_type: string,
  created_at: Date,
  discovery_status: string,
  discovery_progress_percentage: number,
  app_tenant_id: string,
  app_tenant_group_id: string

}

const CloudOnbarodSchema: Schema<ICloudOnbarod> = new mongoose.Schema({
  _id: {
    type: String,
    default: () => new mongoose.Types.ObjectId().toString('hex'),
  },
  _cls: {
    type: String,
    required: true,
    index: true
  },
  apikey: {
    type: String,
  },
  apisecret: {
    type: String,
  },
  cluster_count: {
    type: Number,
    default: 0,
  },
  container_enabled: {
    type: Boolean,
    default: false,
  },
  created_by: {
    type: String,
    required: true,
  },
  dns_enabled: {
    type: Boolean,
    default: true
  },
  enabled: {
    type: Boolean,
    default: true
  },
  key: {
    type: String,
  },
  machine_count: {
    type: Number,
    default: 0,
  },
  object_storage_enabled: {
    type: Boolean,
    default: true
  },
  observation_logs_enabled: {
    type: Boolean,
    default: false,
  },
  owned_by: {
    type: String,
    required: true,
  },
  owner: {
    type: String,
    index: true
  },
  polling_interval: {
    type: Number,
    default: 86400,
  },
  region: {
    type: String
  },
  secret: {
    type: String,
  },
  starred: {
    type: [String],
    default: [],
  },
  subscription_id: {
    type: String,
  },
  tenant_id: {
    type: String,
    index: true
  },
  title: {
    type: String,
    alias: 'account_name',
    index: true
  },
  unstarred: {
    type: [String],
    default: [],
  },
  account_type: {
    type: String,
  },
  access_type: {
    type: String,
  },
  environment: {
    type: String,
  },
  authentication_protocol: {
    type: String,
  },
  bucket_name: {
    type: String,
  },
  cost_report_format_fields: {
    type: String,
  },
  opted_regions: {
    type: [String],
    default: [],
  },
  discovery_date: {
    type: Date,
    default: null
  },
  application_id: {
    type: String,
  },
  subscription_type: {
    type: String,
  },
  created_at: {
    type: Date
  },
  discovery_status: {
    type: String,
    default: null
  },
  discovery_progress_percentage: {
    type: Number,
    default: null
  },
  app_tenant_id: {
    type: String,
    index: true
  },
  app_tenant_group_id: {
    type: String,
    index: true
  }
}, { collection: appConstant.SCHEMA.CLOUD_ONBOARD });

CloudOnbarodSchema.index({ owner: 1, _cls: 1, app_tenant_id: 1, app_tenant_group_id: 1 });

CloudOnbarodSchema.index({ _id: 1, _cls: 1 });

export const CloudOnbarod = mongoose.model<ICloudOnbarod>('CloudOnbarod', CloudOnbarodSchema);

export const cloudOnboardCreate = (values: any) => new CloudOnbarod(values).save().then((cloudOnboard) => cloudOnboard.toObject());

export const findCloudAccountByFields = (dynamicFields: Record<string, any>) => CloudOnbarod.findOne(dynamicFields);

export const findCloudAccountAndUpdate = (dynamicFields: Record<string, any>, values: Record<string, any>) => CloudOnbarod.findOneAndUpdate(dynamicFields, values, { new: true });

export const cloudUserCount = (dynamicFields: Record<string, any>) => CloudOnbarod.countDocuments(dynamicFields);

export const findAll = (dynamicFields: Record<string, any>) => CloudOnbarod.find(dynamicFields);
 
export const findAllById = (cloud_id: any, cloud_type: any) => CloudOnbarod.find({_id : {$in: cloud_id}, _cls: cloud_type})

export const cloundAccountUpdate = (_id: any, dynamicFields: Record<string, any>) => CloudOnbarod.findOneAndUpdate({ _id }, { $set: dynamicFields }, { new: true })

