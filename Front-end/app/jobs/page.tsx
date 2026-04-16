"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import Navbar from "@/components/Navbar";
import { groupEnd } from "console";

export default function PublicJobs() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
    const [coverLetter, setCoverLetter] = useState("");
      const [applications, setApplications] = useState<any[]>([]);

  const fetchJobs = async () => {
    try {
      const res = await api.get(`/jobs?search=${search}&location=${location}`);
      setJobs(res.data);
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
  const [selectedJob, setSelectedJob] = useState<any>(null);

  useEffect(() => {
    fetchJobs();
  }, [search, location]);

  return (
    <div >
         <div style={{ display: 'flex', justifyContent: "center", width: "100%"}}><Navbar/></div>
      <div>
              
        <h1 style={{textAlign:"center", color:"green"}}>Explore Jobs</h1>
              <div style={{ display: 'flex', justifyContent: "center", width: "100%" }}>
          <input type="text" placeholder="Job title..." value={search} onChange={(e) => setSearch(e.target.value)} style={{marginRight:10, padding:5, width:"25%"}} />
          <input type="text" placeholder="Location..." value={location} onChange={(e) => setLocation(e.target.value)} className="input w-1/3" style={{padding:5, width:"25%"}}/>
        </div><br/>

              <div style={{ display:"flex",justifyContent: "center", width: "100%" }}>
                <div style={{backgroundColor:"#f0f8f3", padding:"10px 70px"}}>
          {jobs.map((job) => (
            <div key={job._id}>
              <div className="flex-1">
                <h3 style={{color:"green"}}>{job.title}</h3>
                
                <p>Location: {job.location} • Salary Range: {job.salaryRange}</p>
                <p className="text-sub">Job Description: {job.description}</p>
              </div>
              <a href="/auth/login" style={{color:"black", backgroundColor:"lightgreen", padding:5, textDecorationLine:"none"}}>Apply Now</a>
              <div style={{ display: 'flex', justifyContent: "center", width: "100%" }}>
            {selectedJob ? (
              <div>
                <h2 className="heading mb-2">job: {selectedJob.title}</h2>
                <form onSubmit={handleApply} className="flex flex-col gap-4">
                  <textarea placeholder="Cover letter..." value={coverLetter} style={{width:"100%", height:'10'}} onChange={(e) => setCoverLetter(e.target.value)}
                    required minLength={10}  />

                  <div className="flex gap-2">
                    <button type="submit" style={{padding:5, marginRight:5, backgroundColor:"lightgreen"}}>Submit</button>
                    <button type="button" onClick={() => setSelectedJob(null)} style={{padding:5, backgroundColor:"lightcoral"}}>Cancel</button>
                  </div>
                </form>
              </div>
            ) : (
              <>
              <div>
                
              </div>
              </>
            )}
          </div><hr/>
            </div>
          ))}
          {jobs.length === 0 && <p className="text-sub text-center p-8">No jobs found.</p>}
        </div>
      </div>
      </div>
    </div>
  );
}
