import express from 'express';
import { applyToJob, getCandidateApplications, changeApplicationStatus } from '../controllers/applicationController';
import { protect, requireRole } from '../middleware/auth';

const router = express.Router();

router.post('/jobs/:id/apply', protect, requireRole('candidate'), applyToJob);
router.get('/me', protect, requireRole('candidate'), getCandidateApplications);
router.put('/:appId/status', protect, requireRole('recruiter'), changeApplicationStatus);

export default router;
