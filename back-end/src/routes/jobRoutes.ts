import express from 'express';
import { createJob, editJob, getJobs, getRecruiterJobs, getApplicantsForJob } from '../controllers/jobController';
import { protect, requireRole, requireJobOwnership } from '../middleware/auth';

const router = express.Router();

router.get('/', getJobs);
router.post('/', protect, requireRole('recruiter'), createJob);
router.get('/me', protect, requireRole('recruiter'), getRecruiterJobs);
router.put('/:id', protect, requireRole('recruiter'), requireJobOwnership, editJob);
router.get('/:id/applicants', protect, requireRole('recruiter'), requireJobOwnership, getApplicantsForJob);

export default router;
