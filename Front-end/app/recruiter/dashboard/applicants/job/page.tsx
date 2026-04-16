"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";

export default function RecruiterDashboard() {
  const { user, loading } = useAuth();
  const [jobs, setJobs] = useState<any[]>([]);
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [minSalary, setMinSalary] = useState("");
  const [maxSalary, setMaxSalary] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");

  const [editingJobId, setEditingJobId] = useState<string | null>(null);

  const fetchJobs = async () => {
    try {
      const res = await api.get("/jobs/me");
      setJobs(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (!loading && user?.role === "recruiter") {
      fetchJobs();
    }
  }, [user, loading]);

  const startEdit = (job: any) => {
    const [min, max] = job.salaryRange.split('-');
    setEditingJobId(job._id);
    setTitle(job.title);
    setLocation(job.location);
    setMinSalary(min || "");
    setMaxSalary(max || "");
    setDescription(job.description);
    setError("");
  };

  const handleClose = async (jobId: string, currentStatus: boolean) => {
    try {
      await api.put(`/jobs/${jobId}`, { closed: !currentStatus });
      fetchJobs();
    } catch (err) {
      console.error(err);
    }
  };

  const resetForm = () => {
    setEditingJobId(null);
    setTitle("");
    setLocation("");
    setMinSalary("");
    setMaxSalary("");
    setDescription("");
    setError("");
  };

  if (loading) return <div>Loading...</div>;
  if (user?.role !== "recruiter") return <div>Unauthorized</div>;

  return (
    <>
      <div style={{ display: 'flex', justifyContent: "center", width: "100%" }}>
        <Navbar />
      </div>
      <h2 style={{ color: "green"}}>Recruiter Dashboard</h2><hr/>
      <Link href="/recruiter/dashboard" style={{textDecoration:"none", color:"#ec4426",  textAlign:"right", display:"block",}} >◀ Back</Link>
      <div style={{ display: 'flex', justifyContent: "center", width: "100%" }}>
        <div>
          <div>
            
            <h2 style={{ color: "green", textAlign:"center", alignItems:"center" }}>All posted jobs</h2>
          
<br/>            <div style={{backgroundColor:"#e7f5ec", padding:30, borderRadius:"5%"}}>
              <div>
                {jobs.map((job) => (
                  <div key={job._id} className="card">
                    <div>
                      <div><hr/>
                        <h3 style={{ color: "green"}}>• {job.title}</h3>
                        <p className="text-sub">location: {job.location} • <span>Salary: {job.salaryRange}</span></p>
                        <p style={{color:"gray"}}>job description: <span>{job.description}</span></p>
                      </div>
                      <span className={`${job.closed ? 'closed' : 'active'}`} style={{color:"#bb0b0b"}}>
                        {job.closed ? 'Closed' : 'Active'}
                      </span>
                    </div>
                    <div>


                      <button style={{backgroundColor:"gray", color:"white", padding:10, marginRight:10, borderRadius:"30%"}} onClick={() => startEdit(job)}>Edit</button>
                      <button onClick={() => handleClose(job._id, job.closed)} style={{backgroundColor:"lightcoral", color:"black", padding:10, marginRight:200, borderRadius:"30%"}}>
                        {job.closed ? "Reopen" : "Close"}
                      </button>
                      <a href={`/recruiter/dashboard/applicants/${job._id}`} style={{textDecoration:"none", color:"lightseagreen"}} >
                        Applicants →
                      </a>
                    </div>
                  </div>
                ))}
                {jobs.length === 0 && <p className="text-sub">No jobs posted yet.</p>}
              </div>  
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
