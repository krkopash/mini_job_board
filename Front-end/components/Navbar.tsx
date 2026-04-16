"use client";

import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
  };

  return (
    <nav style={{backgroundColor:"#d9f1e2", width:"100%", textAlign:"center"}}>
    {/* //, width:"100%", padding:5,textAlign:"center"}}> */}
      <Link href="/" className="heading" style={{textDecoration:"none", color:"black"}}>Mini Job Board</Link> ||  <Link href="/jobs" style={{textDecoration:"none", color:"black"}}>Browse Jobs </Link>|| {user ? (
          <>
            <span className="text-sub">
              {user.name} (Role: {user.role})
            </span><br/>
            <div style={{textAlign:"end", display:"block"}}> 
            <button onClick={handleLogout} style={{backgroundColor:"lightcoral", padding:8, borderRadius:"10%", color:"white"}}>
              Logout
            </button><br/><br/>
            </div>
          </>
        ) : (
          <>
            <Link href="/auth/login">Login</Link>
            <Link href="/auth/signup">Sign Up</Link>
          </>
        )}
      
    </nav>
  );
}
