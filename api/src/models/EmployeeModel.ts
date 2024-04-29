import mongoose, { Schema, Document, Model } from 'mongoose';
import { UserRole } from '../common/userRole';

export interface Employee extends Document {
  name: string;
  empId: number;
  email: string;
  password: string;
  role: UserRole;
  department: string;
  jobTitle: string;
  managerIds: string[];
  leaveBalance: number;
  createdDate: number;
  updatedDate: number;
}

const employeeSchema: Schema<Employee> = new Schema({
  name: {
    type: String,
    required: true
  },
  empId: {
    type: Number,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    required: true,
    enum: Object.values(UserRole)
  },
  department: {
    type: String,
    required: true
  },
  jobTitle: {
    type: String
  },
  managerIds: {
    type: [String]
  },
  leaveBalance: {
    type: Number
  },
  createdDate: {
    type: Number,
    default: Date.now()
  },
  updatedDate: {
    type: Number,
    default: Date.now()
  }
});

const EmployeeModel: Model<Employee> = mongoose.model<Employee>('Employee', employeeSchema);

export default EmployeeModel;
