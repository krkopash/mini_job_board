import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import Job from '../models/Job';
import asyncHandler from 'express-async-handler';

export interface AuthRequest extends Request {
  user?: any;
}

export const protect = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

if(!token){
    throw new Error('Not authorized, no token');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as any;
    req.user = await User.findById(decoded.id).select('-passwordHash');
    next();
  } catch (error) {
    throw new Error('Not authorized, token failed');
  }
});

export const requireRole = (role: 'recruiter' | 'candidate') => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (req.user && req.user.role === role) {
      next();
    } else {
      throw new Error(`Forbidden: Requires ${role} role`);
    }
  };
};

export const requireJobOwnership = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const job = await Job.findById(req.params.id);
  if (!job) {
    throw new Error('Job not found');
  }

  if (job.recruiterId.toString() !== req.user._id.toString()) {
    throw new Error('Forbidden: You do not own this job');
  }
  next();
});
