"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import api from "@/lib/api";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setUser } = useAuth();
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/login", { email, password });
      setUser(res.data);
      router.push(res.data.role === "recruiter" ? "/recruiter/dashboard" : "/candidate/dashboard");
    } catch (err: any) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
     <div style={{ display: 'flex', justifyContent: "center", width: "100%", marginTop:200 }}>
      
      <form onSubmit={handleSubmit} style={{backgroundColor:"#ebf8f0", padding:"20px 100px", borderRadius:"10%"}}>
         <h2 style={{ color: "#16a34a" }}>Login</h2>
        {error && <p>{error}</p>}
        <div>
          <label>Email:</label><br/>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}style={{width:"100%"}}/>
        </div><br/>
        <div>
          <label>Password:</label><br/>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} style={{width:"100%"}} />
        </div><br/>
        <button type="submit" style={{padding:5, width:"100%", backgroundColor:"#49e682"}}>Sign In</button>
        <p>
          Don't have an account? <a href="/auth/signup">Sign Up</a>
        </p>
      </form>
    </div>
  );
}
