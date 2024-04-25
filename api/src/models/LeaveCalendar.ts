import mongoose, { Schema, Document, Model } from 'mongoose';

export interface LeaveCalendar extends Document {
  leaveName: string;
  year: number;
  date: string;
  day: string;
  country: string;
  createdDate: number;
}

const leaveCalendarSchema: Schema<LeaveCalendar> = new Schema({
  leaveName: {
    type: String,
    required: true
  },
  year: {
    type: Number,
    required: true
  },
  date: {
    type: String,
    required: true
  },
  day: {
    type: String
  },
  country: {
    type: String,
    required: true
  },
  createdDate: {
    type: Number,
    default: Date.now()
  }
});

const LeaveCalendarModel: Model<LeaveCalendar> = mongoose.model<LeaveCalendar>('LeaveCalendar', leaveCalendarSchema);

export default LeaveCalendarModel;
