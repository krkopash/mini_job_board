import { Response } from 'express';
import asyncHandler from 'express-async-handler';
import Job from '../models/Job';
import Application from '../models/Application';
import { AuthRequest } from '../middleware/auth';
import z from 'zod';

const jobSchema = z.object({
  title: z.string().min(2),
  location: z.string().min(2),
  salaryRange: z.string().refine((val) => {
    const [min, max] = val.split('-').map(Number);
    return min < max;}, "Minimum salary must be less than maximum salary"),
  description: z.string().min(10),
});

export const createJob = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { title, location, salaryRange, description } = jobSchema.parse(req.body);

  const job = await Job.create({
    recruiterId: req.user._id,
    title,
    location,
    salaryRange,
    description,
  });

  res.json(job);
});

export const editJob = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { title, location, salaryRange, description, closed } = req.body;
  
  const job = await Job.findById(req.params.id);

  if (job) {
    job.title = title || job.title;
    job.location = location || job.location;
    job.salaryRange = salaryRange || job.salaryRange;
    job.description = description || job.description;
    if (closed !== undefined) job.closed = closed;

    const updatedJob = await job.save();
    res.json(updatedJob);
  } else {
    throw new Error('Job not found');
  }
});

export const getJobs = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { search, location } = req.query;

  const query: any = { closed: false };

  if (search && typeof search === 'string') {
    query.$text = { $search: search };
  }
  if (location && typeof location === 'string') {
    query.location = { $regex: location, $options: 'i' };
  }

  const jobs = await Job.find(query).sort({ createdAt: -1 });
  res.json(jobs);
});

export const getRecruiterJobs = asyncHandler(async (req: AuthRequest, res: Response) => {
  const jobs = await Job.find({ recruiterId: req.user._id }).sort({ createdAt: -1 });
  res.json(jobs);
});

export const getApplicantsForJob = asyncHandler(async (req: AuthRequest, res: Response) => {
  const applicants = await Application.find({ jobId: req.params.id }).populate('candidateId', 'name email');
  res.json(applicants);
});
