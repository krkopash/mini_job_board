"use client";
import './globals.css'

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (user) {
        router.push(user.role === "recruiter" ? "/recruiter/dashboard" : "/candidate/dashboard");
      } else {
        router.push("/jobs");
      }
    }
  }, [user, loading, router]);

  return <div>Redirecting...</div>;
}
