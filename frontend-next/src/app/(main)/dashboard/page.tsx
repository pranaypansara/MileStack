"use client";

import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";
import { Contract } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Wallet, Lock, ArrowUpRight, Clock, ShieldCheck, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useContext } from "react";
import { AuthContext } from "@/context/AuthContext";

export default function DashboardPage() {
  const { user } = useContext(AuthContext);

  const { data: contracts, isLoading } = useQuery<Contract[]>({
    queryKey: ["contracts"],
    queryFn: async () => {
      const res = await api.get("/contracts");
      return res.data;
    },
  });

  const activeContracts = contracts?.filter(c => c.status === "active") || [];
  const pendingContracts = contracts?.filter(c => c.status === "pending_freelancer_approval") || [];

  const totalEarnings = contracts?.reduce((acc, c) => acc + (c.paymentStatus === 'deposited' ? c.totalAmount : 0), 0) || 0;
  const inEscrow = contracts?.reduce((acc, c) => acc + (c.paymentStatus === 'pending' && c.status === 'active' ? c.totalAmount : 0), 0) || 0;

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      {/* Top Stats */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <Card className="bg-slate-900/40 border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium text-slate-400 uppercase tracking-wider">Total Earnings</CardTitle>
            <Wallet className="h-4 w-4 text-slate-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">${totalEarnings.toLocaleString()}</div>
            <p className="text-xs text-emerald-500 mt-1 flex items-center">
              <ArrowUpRight className="mr-1 h-3 w-3" /> +12% from last month
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-slate-900/40 border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium text-slate-400 uppercase tracking-wider">Active Contracts</CardTitle>
            <FileText className="h-4 w-4 text-slate-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">{activeContracts.length}</div>
            <p className="text-xs text-slate-400 mt-1 flex items-center">
              <Clock className="mr-1 h-3 w-3" /> {pendingContracts.length} awaiting approval
            </p>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/40 border-slate-800 relative overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium text-slate-400 uppercase tracking-wider">In Escrow</CardTitle>
            <Lock className="h-4 w-4 text-slate-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">${inEscrow.toLocaleString()}</div>
            <p className="text-xs text-slate-400 mt-1 flex items-center">
              <ShieldCheck className="mr-1 h-3 w-3 text-emerald-500" /> Secured by MileStack
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Active Contracts List */}
          <Card className="bg-slate-900/40 border-slate-800">
            <CardHeader className="flex flex-row items-center justify-between border-b border-slate-800/50 pb-4">
              <CardTitle className="text-lg">Active Contracts</CardTitle>
              <Button variant="link" asChild className="text-blue-500 text-sm p-0 h-auto">
                <Link href="/contracts">View All</Link>
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              {isLoading ? (
                <div className="p-8 text-center text-slate-500 text-sm">Loading contracts...</div>
              ) : contracts && contracts.length > 0 ? (
                <div className="divide-y divide-slate-800/50">
                  <div className="grid grid-cols-4 px-6 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">
                    <div className="col-span-2">Project Name</div>
                    <div>Status</div>
                    <div className="text-right">Value</div>
                  </div>
                  {contracts.map(contract => (
                    <Link key={contract._id} href={`/contracts/${contract._id}`} className="grid grid-cols-4 items-center px-6 py-4 hover:bg-slate-800/30 transition-colors">
                      <div className="col-span-2">
                        <div className="font-medium text-slate-200">{contract.title}</div>
                        <div className="text-xs text-slate-500 mt-1 truncate pr-4">{contract.description}</div>
                      </div>
                      <div>
                        <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                          contract.status === 'active' ? 'bg-blue-500/10 text-blue-400' :
                          contract.status === 'pending_freelancer_approval' ? 'bg-amber-500/10 text-amber-400' :
                          contract.status === 'completed' ? 'bg-emerald-500/10 text-emerald-400' :
                          'bg-slate-500/10 text-slate-400'
                        }`}>
                          {contract.status.replace('_', ' ')}
                        </span>
                      </div>
                      <div className="text-right font-medium text-slate-200">
                        ${contract.totalAmount.toLocaleString()}
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center text-slate-500 text-sm">No contracts found. Create one to get started.</div>
              )}
            </CardContent>
          </Card>

          {/* Next Milestones (Visual Only / Fallback) */}
          <Card className="bg-slate-900/40 border-slate-800">
            <CardHeader className="border-b border-slate-800/50 pb-4">
              <CardTitle className="text-lg">Next Milestones</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="text-center text-sm text-slate-500">
                <p>Milestone tracking functionality requires viewing specific contracts.</p>
                <Button variant="outline" size="sm" asChild className="mt-4 border-slate-700 text-slate-300">
                  <Link href="/contracts">View Contracts</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-8">
          
          {/* MileStack PRO Banner */}
          <div className="rounded-xl bg-gradient-to-br from-blue-600 to-blue-800 p-6 text-white shadow-lg relative overflow-hidden">
            <div className="relative z-10">
              <div className="inline-flex items-center rounded-full bg-white/20 px-2 py-1 text-xs font-medium mb-4 backdrop-blur-sm">
                <span className="mr-1">★</span> MILESTACK PRO
              </div>
              <h3 className="text-xl font-bold mb-2">Scale your freelance empire.</h3>
              <p className="text-sm text-blue-100 mb-6">
                Get zero-fee withdrawals, early payment access, and advanced contract templates.
              </p>
              <Button className="w-full bg-white text-blue-600 hover:bg-slate-100 font-semibold shadow-sm">
                Upgrade Now — $19/mo
              </Button>
            </div>
            <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-white/10 blur-2xl"></div>
          </div>

          {/* Pending Actions */}
          <Card className="bg-slate-900/40 border-slate-800">
            <CardHeader className="pb-4">
              <CardTitle className="text-sm font-medium">Pending Actions</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-slate-800/50">
                {pendingContracts.map(c => (
                  <Link key={c._id} href={`/contracts/${c._id}`} className="flex items-center p-4 hover:bg-slate-800/30 transition-colors">
                    <div className="mr-4 flex h-8 w-8 items-center justify-center rounded-full bg-amber-500/10 text-amber-500">
                      <span className="text-sm font-bold">!</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-slate-200">Signature Required</p>
                      <p className="text-xs text-slate-500 truncate">{c.title}</p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-slate-500" />
                  </Link>
                ))}
                {pendingContracts.length === 0 && (
                  <div className="p-4 text-center text-xs text-slate-500">No pending actions</div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
