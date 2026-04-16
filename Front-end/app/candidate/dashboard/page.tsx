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
      <div>
        <div>
          <h2 style={{color:"green"}}>Candidate Portal</h2><hr/>
         <Link href="/candidate/status" style={{textDecoration:"none", color:"red", textAlign:"right", display:"block", marginRight:20}}>Check status ▶</Link>
          <div style={{textAlign:"center", alignItems:"center" }}>
            <h3 className="heading">Browse Marketplace</h3>
            <div>
              <input type="text" placeholder="Title..." value={search} onChange={(e) => setSearch(e.target.value)} style={{marginRight:10, width:"20%", padding:5}} />
              <input type="text" placeholder="Location..." value={location} onChange={(e) => setLocation(e.target.value)} className="input w-1/3" style={{padding:5, width:"20%"}}/>
            </div>
            
            <div style={{backgroundColor:"#e7f5ec", margin:"10px 500px", padding:5, borderRadius:"5%"}}>
              <div>
              {jobs.map((job) => (
                <div key={job._id}>
                  <div>
                    <div>
                      <h3 style={{color:"green"}}>{job.title}</h3>
                      <p>{job.location} • {job.salaryRange}</p>
                    </div>
                    <button onClick={() => setSelectedJob(job)} style={{padding:5, backgroundColor:"lightgreen"}}>Apply</button>
                  </div>
                  <p style={{color:"gray"}}> Job description: {job.description}</p><hr/><hr/>
                </div>
              ))}
              {jobs.length === 0 && <p>No matching jobs.</p>}
              
            </div>
                </div>
          </div>

          <div style={{ display: 'flex', justifyContent: "center", width: "100%" }}>
            {selectedJob ? (
              <div>
                <h2 className="heading mb-2">Apply: {selectedJob.title}</h2>
                <form onSubmit={handleApply} className="flex flex-col gap-4">
                  <textarea placeholder="Cover letter..." value={coverLetter} style={{width:"100%",}} onChange={(e) =>setCoverLetter(e.target.value)}
                    required minLength={10} /><br/><br/>

                  <div className="flex gap-2">
                    <button type="submit" style={{padding:5, marginRight:5, backgroundColor:"lightgreen"}}>Submit</button>
                    <button type="button" onClick={() => setSelectedJob(null)} style={{padding:5, backgroundColor:"lightcoral"}}>Cancel</button>
                  </div><br/><br/><br/>
                </form>
              </div>
            ) : (
              <>
              <div>
                
              </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
