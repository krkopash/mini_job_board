## Mini Job Board — Recruiters Post, Candidates Apply 

## Getting Started

For starts front-end:
cd Front-end
npm install
npm run dev

For start back-end:
cd backend
npm install
npm run dev

## Core Features:
## for candidate:
candidate can applu any jobs
can search by title and location
shows their status (applied, shortlisted, rejected)
check all previous applied jobs history
user can apply with attach their coverletter data(skills)

## for recruiter:
Post new jobs with title, location, salary range, description(criteria)
delete and edit job info
shows applicants for each job
change their status (applied, shortlisted, rejected)
can close and reopen any jobs

Signup chooses role: 'recruiter' or 'candidate' (immutable). 
Recruiter: create/edit/close jobs (title, location, salaryRange, description). 
Candidate: public browse /jobs with search by title and filter by location. 
Candidate: POST /api/jobs/:id/apply with coverLetter. 
Candidate: 'My Applications' page with status (applied / shortlisted / rejected). 
Recruiter: 'Applicants' page per job; can change an application's status. 
A candidate cannot apply to the same job twice. 

Open [http://localhost:3000]with your browser to see the result.
