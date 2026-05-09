"use client";

import { useState, useContext, FormEvent } from "react";
import { AuthContext } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock, Mail } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useContext(AuthContext);
  const router = useRouter();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    const result = await login(email, password);
    if (result.success) {
      router.push("/dashboard");
    } else {
      setError(result.message || "Failed to login");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0B101E] px-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900/50 p-8 shadow-2xl backdrop-blur-sm">
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-2xl font-semibold text-white">Welcome Back</h1>
          <p className="text-sm text-slate-400">Access your professional workspace</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <div className="text-sm text-red-500 text-center">{error}</div>}
          
          <div className="space-y-2">
            <Label htmlFor="email">Professional Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
              <Input
                id="email"
                type="email"
                placeholder="name@company.com"
                className="pl-10"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <a href="#" className="text-xs text-slate-400 hover:text-white">Forgot password?</a>
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                className="pl-10"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="flex items-center space-x-2 pb-4">
            <input type="checkbox" id="remember" className="rounded border-slate-800 bg-slate-900 accent-blue-600" />
            <label htmlFor="remember" className="text-sm text-slate-400">
              Remember this device for 30 days
            </label>
          </div>

          <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 h-11">
            <div className="flex items-center justify-center">
              <span className="mr-2">✓</span> Secure Sign In
            </div>
          </Button>
        </form>

        <div className="mt-6 text-center text-sm text-slate-400">
          Don't have an account? <Link href="/register" className="font-medium text-white hover:underline">Join MileStack</Link>
        </div>
      </div>

      <div className="fixed bottom-4 left-0 right-0 flex justify-center space-x-8 text-xs text-slate-500">
        <div className="flex items-center"><Lock className="mr-1 h-3 w-3" /> AES-256 Encryption</div>
        <div className="flex items-center"><span className="mr-1">✓</span> ISO 27001 Certified</div>
      </div>
    </div>
  );
}
