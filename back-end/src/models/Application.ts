import mongoose, { Schema, Document } from 'mongoose';

export interface IApplication extends Document {
  jobId: mongoose.Types.ObjectId;
  candidateId: mongoose.Types.ObjectId;
  coverLetter: string;
  status: 'applied' | 'shortlisted' | 'rejected';
}

const ApplicationSchema: Schema = new Schema({
  jobId: { type: Schema.Types.ObjectId, ref: 'Job', required: true, unique: true},
  candidateId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  coverLetter: { type: String, required: true },
  status: { type: String, enum: ['applied', 'shortlisted', 'rejected'], default: 'applied' }
}, { timestamps: true });

ApplicationSchema.index({ jobId: 1, candidateId: 1 }, { unique: true });

export default mongoose.model<IApplication>('Application', ApplicationSchema);
