"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";

export default function CandidateDashboard() {
  const { user, loading } = useAuth();
  const [jobs, setJobs] = useState<any[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [coverLetter, setCoverLetter] = useState("");
  const [selectedJob, setSelectedJob] = useState<any>(null);
  console.log(selectedJob, "selectedJob");
  const fetchJobs = async () => {
    try {
      const res = await api.get(`/jobs?search=${search}&location=${location}`);
      setJobs(res.data);
      console.log(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchApplications = async () => {
    try {
      const res = await api.get("/applications/me");
      setApplications(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [search, location]);

  useEffect(() => {
    if (!loading && user?.role === "candidate") {
      fetchApplications();
    }
  }, [user, loading]);

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post(`/applications/jobs/${selectedJob._id}/apply`, { coverLetter });
      setCoverLetter("");
      setSelectedJob(null);
      fetchApplications();
      alert("Applied successfully!");
      console.log("")
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to apply");
    }
  };

  if (loading) return <div>Loading...</div>;
  if (user?.role !== "candidate") return <div>Unauthorized</div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: "center", width: "100%" }}>
              <Navbar />
            </div>
            <h2 style={{color:"green"}}>Candidate Portal</h2><hr/>
            <Link href="/candidate/dashboard" style={{textAlign:"right", display:"block", textDecoration:"none", color:"red"}}> ◀ Dashboard</Link>
      <div><br/>
        <div style={{ display: 'flex', justifyContent: "center", width: "100%" }}>

          <div>
              <>
                <h2 style={{color:"green"}}>Your Status</h2><hr/>
                 <div style={{backgroundColor:"#e8f8ee", padding:"10px 200px", borderRadius:"5%"}}>
                    <div>
{applications.map((app) => (
                    <div key={app._id}>
                      <div>
                        <h3 style={{color:"green"}}>• {app.jobId?.title || "Project"}</h3>
                        <p className="text-sub text-xs">Applied {new Date(app.createdAt).toLocaleDateString()}</p>
                      </div>
                      <span className={`px-2 py-1 text-xs font-bold rounded border ${app.status === 'applied' ? 'bg-zinc-50 text-zinc-500' :
                          app.status === 'shortlisted' ? 'bg-green-50' :''
                        }`} style={{color:"lightcoral"}}>
                        {app.status.toUpperCase()}
                      </span><hr/>
                    </div>
                  ))}
                    </div>
                  
                  {applications.length === 0 && <p className="text-sub">No applications yet.</p>}
                </div>
              </>
              
          </div>
        </div>
      </div>
    </div>
  );
}
