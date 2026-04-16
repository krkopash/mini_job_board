import mongoose, { Schema, Document } from 'mongoose';

export interface IJob extends Document {
  recruiterId: mongoose.Types.ObjectId;
  title: string;
  location: string;
  salaryRange: string;
  description: string;
  closed: boolean;
}

const JobSchema: Schema = new Schema({
  recruiterId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  location: { type: String, required: true },
  salaryRange: { type: String, required: true },
  description: { type: String, required: true },
  closed: { type: Boolean, default: false },
}, { timestamps: true });

JobSchema.index({ title: 'text', location: 'text' });

export default mongoose.model<IJob>('Job', JobSchema);
