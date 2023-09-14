import mongoose, { Document, Schema } from "mongoose";
import AppConstants from "../utils/constant";

const appConstant = new AppConstants();

interface IActivity extends Document {
    project_id: string,
    project_name: string,
    activity: string
}
interface IAuditTrail extends Document {
    user_id: string,
    type: string,
    activity: IActivity[],
    audit_trail_by: string,
    audit_trail_at: Date
}
const auditTrailSchema: Schema<IAuditTrail> = new mongoose.Schema({
    _id: {
        type: String,
        default: () => new mongoose.Types.ObjectId().toString('hex'),
    },
    user_id: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        enum: ['create', 'update'],
        required: true,
    },
    activity: {
        type: [
            {
                _id: false,
                project_id: {
                    type: String,
                    required: true
                },
                project_name: {
                    type: String,
                    required: true
                },
                activity: {
                    type: String,
                    required: true
                }
            },
        ],
        required: true,
    },
    audit_trail_by: {
        type: String,
        required: true,
    },
    audit_trail_at: {
        type: Date,
        default: Date.now
    },
}, { collection: appConstant.SCHEMA.AUDIT_TRAILS });

const AuditTrail = mongoose.model<IAuditTrail>('AuditTrail', auditTrailSchema);

export { AuditTrail, auditTrailSchema };

/**
 * Create project
 */
export const auditTrailCreate = (values: Record<string, any>) =>AuditTrail.insertMany(values);