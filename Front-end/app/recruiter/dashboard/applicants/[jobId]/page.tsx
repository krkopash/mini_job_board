'use client'
import { useEffect, useState } from "react";
import api from "@/lib/api";
import {use} from "react";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";
import Link from "next/link";

export default function Applicants({ params }:{params: Promise<{jobId: string}>}) {
  const { user, loading } = useAuth();
  const {jobId}=use(params)
  const [applicants, setApplicants] = useState<any[]>([]);

  const fetchApplicants = async () => {
    try {
      const res = await api.get(`/jobs/${jobId}/applicants`);
      setApplicants(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (!loading && user?.role === "recruiter") {
      fetchApplicants();
    }
  }, [user, loading, jobId]);

  const handleStatusChange = async (appId: string, status: string) => {
    try {
      await api.put(`/applications/${appId}/status`, { status });
      fetchApplicants();
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to update status");
    }
  };

  if (loading) return <div>Loading...</div>;
  if (user?.role !== "recruiter") return <div>Unauthorized</div>;

  return (
    <div className="min-h-screen">
       <div style={{ display: 'flex', justifyContent: "center", width: "100%" }}>
<Navbar/>
      </div>
      <h2 style={{ color: "green"}}>Recruiter Dashboard</h2><hr/>
      <Link href="/recruiter/dashboard/applicants/job" style={{textDecoration:"none", color:"#ec4426",  textAlign:"right", display:"block",}} >◀ Job board</Link>
      <div style={{alignItems:"center", justifyContent:"center", textAlign:"center"}}>
        <div>
            <h1 style={{color:"green"}}>Applicants</h1>
        </div>

      <div style={{backgroundColor:"#e8f8ee", margin:"20px 600px", padding:"10", borderRadius:"5%"}}>
          {applicants.map((app) => (
            <div key={app._id} className="card">
              <div>
                <div>
                  <h3 style={{color:"lightcoral", paddingTop:10}}>- Candidate name: {app.candidateId?.name}</h3>
                  <p> mailid: {app.candidateId?.email}</p>
                </div>
                <label style={{marginRight:10}}>status:</label>
                <select value={app.status} 
                  onChange={(e) => handleStatusChange(app._id, e.target.value)}>
                  <option value="applied">Applied</option>
                  <option value="shortlisted">Shortlisted</option>
                  <option value="rejected">Rejected</option>
                </select>
                
              </div>
              <div style={{color:"gray"}}>cover letter: 
                "{app.coverLetter}"
              </div><hr/>
            </div>
            
          ))}
          {applicants.length === 0 && <p>No applicants yet</p>}
        </div>
      </div>
    </div>
  );
}
