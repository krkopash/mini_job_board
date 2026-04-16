"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";
import Link from "next/link";

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

  const handlePostJob = async (e: React.FormEvent) => {
    e.preventDefault();
    const salaryRange = `${minSalary}-${maxSalary}`;
    try {
      if (editingJobId) {
        await api.put(`/jobs/${editingJobId}`, { title, location, salaryRange, description });
      } else {
        await api.post("/jobs", { title, location, salaryRange, description });
      }
      resetForm();
      fetchJobs();
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to save job");
      console.error(err);
    }
  };

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
      <Link href="/recruiter/dashboard/applicants/job" style={{textDecoration:"none", color:"#f51111", textAlign:"right", display:"block",  }}>Show applications ▶</Link><br/>
      <div style={{ display: 'flex', justifyContent: "center", width: "100%" }}>
        <div>
          <div className="mb-8">
            
          </div>

          <div>
            <div>
              <h2 style={{marginLeft:150}}>{editingJobId ? "Edit Job" : "Post Job"}</h2>
              
              <form onSubmit={handlePostJob}>
                {error && <p>{error}</p>}
                <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} required className="input" style={{ width:"100%", padding: 5, marginBottom: 10 }} />
                <input type="text" placeholder="Location" value={location} onChange={(e) => setLocation(e.target.value)} required className="input" style={{width:"100%", padding: 5, marginBottom:10 }} />
                <div>
                  <input type="number" placeholder="Min Salary" value={minSalary} onChange={(e) => setMinSalary(e.target.value)} required className="input" style={{ width:"100%",padding: 5, marginBottom: 10 }} />
                  <input type="number" placeholder="Max Salary" value={maxSalary} onChange={(e) => setMaxSalary(e.target.value)} required className="input" style={{width:"100%", padding: 5, marginBottom:10}} />
                </div>
                <textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} required minLength={10} style={{ height:70, width: "100%" }} />
                <div>


                  <button type="submit" style={{ padding: 7, backgroundColor:"#c6f1d5", color:"black",marginTop:5, width:"100%", borderRadius:"10%"}}>{editingJobId ? "Update" : "Publish"}</button>
                  {editingJobId && (
                    <button type="button" onClick={() => resetForm()}>Cancel</button>
                  )}
                </div>
              </form>
            </div><br/>

        
          </div>
        </div>
      </div>
    </>
  );
}
