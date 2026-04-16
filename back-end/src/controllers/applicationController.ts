import { Response } from 'express';
import asyncHandler from 'express-async-handler';
import Application from '../models/Application';
import Job from '../models/Job';
import { AuthRequest } from '../middleware/auth';
import z from 'zod';
import mongoose from 'mongoose';

const applySchema = z.object({
  coverLetter: z.string().min(10),
});

export const applyToJob = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { coverLetter } = applySchema.parse(req.body);
  const jobId = req.params.id;
  console.log("done");
  console.log(typeof jobId, "elelelelel")

  const job = await Job.findById(jobId);
  console.log("job", job);
  if (!job || job.closed) {
    throw new Error('Job not found or closed');
  }

  try {
    const application = await Application.create({
      jobId: job?._id,
      candidateId: req.user._id,
      coverLetter,
    });
    res.json(application);
  } catch (error: any) {
    if (error.code === 11000) {
      throw new Error('You have already applied to this job');
    }
    throw error;
  }
});

export const getCandidateApplications = asyncHandler(async (req: AuthRequest, res: Response) => {
  const applications = await Application.find({ candidateId: req.user._id }).populate('jobId');
  res.json(applications);
});

export const changeApplicationStatus = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { status } = req.body;
  const appId = req.params.appId;

  const application = await Application.findById(appId).populate('jobId');
  if (!application) {
    throw new Error('Application not found');
  }

  const job = await Job.findById(application.jobId);
  if (!job || job.recruiterId.toString() !== req.user._id.toString()) {
    throw new Error('Forbidden: You do not own this job');
  }

  if (['applied', 'shortlisted', 'rejected'].includes(status)) {
    application.status = status;
    const updated = await application.save();
    console.log(`[EMAIL STUB] Candidate ${application.candidateId} application status changed to ${status}`);

    res.json(updated);
  } else {
    throw new Error('Invalid status');
  }
});
