"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import api from "@/lib/api";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"candidate" | "recruiter">("candidate");
  const { setUser } = useAuth();
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/signup", { name, email, password, role });
      setUser(res.data);
      router.push(res.data.role === "recruiter" ? "/recruiter/dashboard" : "/candidate/dashboard");
    } catch (err: any) {
      setError(err.response?.data?.message || "Signup failed");
    }
  };

  return (
   <div style={{ display: 'flex', justifyContent: "center", width: "100%", marginTop:200 }}>
 <form onSubmit={handleSubmit} style={{backgroundColor:"#ebf8f0", padding:"20px 100px", borderRadius:"10%"}}>
         <h2 style={{ color: "#16a34a", marginLeft:30}}>create account</h2>
        {error && <p>{error}</p>}
        <div>
          <div>
            <label>Full Name:</label><br/>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} style={{width:"100%"}} required />
          </div><br/>
          <div>
            <label>Email:</label><br/>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} style={{width:"100%"}} required />
          </div><br/>
        </div>
        <div>
          <label className="text-sub">Password:</label><br/>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} style={{width:"100%"}} required />
        </div><br/>
        <div>
          <label className="text-sub">I am a </label>
          <select value={role} onChange={(e: any) => setRole(e.target.value)} style={{width:"100%"}}>
            <option value="candidate">Candidate</option>
            <option value="recruiter">Recruiter</option>
          </select>
        </div><br/>
        <button type="submit" style={{width:"100%", backgroundColor:"#49e682", padding:5}}>Sign Up</button>
        <p>
          Already have an account? <a href="/auth/login">Login</a>
        </p>
      </form>
    </div>
  );
}
