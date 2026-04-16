import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  email: string;
  passwordHash: string;
  role: 'recruiter' | 'candidate';
  name: string;
}

const UserSchema: Schema = new Schema({
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['recruiter', 'candidate'], required: true },
  name: { type: String, required: true },
}, { timestamps: true });

export default mongoose.model<IUser>('User', UserSchema);
