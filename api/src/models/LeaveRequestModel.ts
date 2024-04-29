import mongoose, { Document, Model, Schema } from 'mongoose';

export interface LeaveRequest extends Document {
  userId: string;
  leaveType: string;
  startDate: number;
  endDate: number;
  managerIds: string[];
  status: string;
  comments: string;
  createdDate: number;
  updatedDate: number;
}

const leaveRequestSchema: Schema<LeaveRequest> = new Schema({
  userId: {
    type: String,
    required: true
  },
  leaveType: {
    type: String,
    required: true
  },
  startDate: {
    type: Number,
    required: true
  },
  endDate: {
    type: Number,
    required: true
  },
  managerIds: {
    type: [String],
    required: true
  },
  status: {
    type: String
  },
  comments: {
    type: String
  },
  createdDate: {
    type: Number,
    default: Date.now
  },
  updatedDate: {
    type: Number,
    default: Date.now
  }
});

const LeaveRequestModel: Model<LeaveRequest> = mongoose.model<LeaveRequest>('LeaveRequest', leaveRequestSchema);

export default LeaveRequestModel;
