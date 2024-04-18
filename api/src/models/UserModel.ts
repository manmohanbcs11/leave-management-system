import mongoose, { Schema, Document, Model } from 'mongoose';
import { UserRole } from '../common/userRole';

export interface User extends Document {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  createdDate: Date;
}

const userSchema: Schema<User> = new Schema({
  name: {
    type: String,
    required: true
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
  createdDate: {
    type: Date,
    default: Date.now
  }
});

const UserModel: Model<User> = mongoose.model<User>('User', userSchema);

export default UserModel;
