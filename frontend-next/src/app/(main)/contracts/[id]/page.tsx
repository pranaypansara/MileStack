"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";
import { Contract, Milestone } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Lock, Clock, FileText, ChevronRight, AlertCircle } from "lucide-react";
import { useContext } from "react";
import { AuthContext } from "@/context/AuthContext";
import { useParams } from "next/navigation";

export default function ContractDetailsPage() {
  const params = useParams();
  const id = params.id as string;
  const { user } = useContext(AuthContext);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery<{ contract: Contract; milestones: Milestone[] }>({
    queryKey: ["contract", id],
    queryFn: async () => {
      const res = await api.get(`/contracts/${id}`);
      return res.data;
    },
  });

  const acceptMutation = useMutation({
    mutationFn: () => api.post(`/contracts/${id}/accept`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["contract", id] }),
  });

  const rejectMutation = useMutation({
    mutationFn: () => api.post(`/contracts/${id}/reject`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["contract", id] }),
  });

  if (isLoading) {
    return <div className="flex h-full items-center justify-center text-slate-500 animate-pulse">Loading contract details...</div>;
  }

  if (!data || !data.contract) {
    return <div className="text-red-500">Contract not found</div>;
  }

  const { contract, milestones } = data;
  const isFreelancer = typeof contract.freelancerId === 'object' ? contract.freelancerId._id === user?._id : contract.freelancerId === user?._id;
  const isClient = typeof contract.clientId === 'object' ? contract.clientId._id === user?._id : contract.clientId === user?._id;

  const totalBudget = contract.totalAmount;
  const earnedAndPaid = milestones.filter(m => m.status === 'approved').reduce((acc, m) => acc + m.amount, 0);
  const inEscrow = milestones.filter(m => m.status === 'in-progress' || m.status === 'completed').reduce((acc, m) => acc + m.amount, 0);
  const completedMilestonesCount = milestones.filter(m => m.status === 'approved').length;
  const progressPercent = milestones.length > 0 ? Math.round((completedMilestonesCount / milestones.length) * 100) : 0;

  return (
    <div className="mx-auto max-w-6xl">
      {/* Header */}
      <div className="mb-8 flex flex-col md:flex-row md:items-start md:justify-between">
        <div>
          <div className="flex items-center text-sm text-slate-400 mb-2">
            <span className="hover:text-white cursor-pointer">Contracts</span>
            <ChevronRight className="mx-1 h-4 w-4" />
            <span className="text-blue-400">{contract.title}</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">{contract.title}</h1>
          <p className="text-sm text-slate-500">Contract ID: #{contract._id.substring(0, 8).toUpperCase()}</p>
        </div>
        
        <div className="mt-4 flex space-x-3 md:mt-0">
          {contract.status === 'pending_freelancer_approval' && isFreelancer && (
            <>
              <Button variant="outline" className="border-red-500/50 text-red-400 hover:bg-red-500/10" onClick={() => rejectMutation.mutate()}>
                Reject Contract
              </Button>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={() => acceptMutation.mutate()}>
                Accept Contract
              </Button>
            </>
          )}
          {contract.status === 'active' && (
            <Button variant="outline" className="border-slate-700 bg-transparent text-slate-300 hover:bg-slate-800">
              Manage Permissions
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Left Column */}
        <div className="space-y-8 lg:col-span-2">
          
          {/* Financial Summary Card */}
          <Card className="bg-slate-900/40 border-slate-800">
            <CardContent className="p-6">
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Total Budget</p>
                  <p className="text-2xl font-bold text-white">${totalBudget.toLocaleString(undefined, {minimumFractionDigits: 2})}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Earned & Paid</p>
                  <div className="flex items-center">
                    <p className="text-2xl font-bold text-emerald-400">${earnedAndPaid.toLocaleString(undefined, {minimumFractionDigits: 2})}</p>
                    {totalBudget > 0 && (
                      <span className="ml-2 inline-flex items-center rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-medium text-emerald-400">
                        {Math.round((earnedAndPaid / totalBudget) * 100)}%
                      </span>
                    )}
                  </div>
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">In Escrow</p>
                  <p className="text-2xl font-bold text-blue-400">${inEscrow.toLocaleString(undefined, {minimumFractionDigits: 2})}</p>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between text-xs text-slate-400 mb-2">
                  <span>Contract Progression</span>
                  <span>{completedMilestonesCount} of {milestones.length} Milestones Completed</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-slate-800">
                  <div 
                    className="h-full bg-blue-600 rounded-full transition-all duration-500" 
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Project Scope Card */}
          <Card className="bg-slate-900/40 border-slate-800">
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <CardTitle className="text-lg">Project Scope</CardTitle>
              <Button variant="link" className="text-blue-500 text-sm p-0 h-auto flex items-center">
                <FileText className="mr-1 h-4 w-4" /> View Full PDF
              </Button>
            </CardHeader>
            <CardContent>
              <p className="text-slate-300 leading-relaxed mb-6">
                {contract.description}
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-4 flex items-start">
                  <CheckCircle2 className="mr-3 h-5 w-5 text-slate-500 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-medium text-white mb-1">Standard Output</h4>
                    <p className="text-xs text-slate-500">As agreed upon in the initial terms.</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Milestones */}
        <div className="space-y-4">
          <Card className="bg-slate-900/40 border-slate-800 h-full">
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <CardTitle className="text-lg">Milestones</CardTitle>
              <span className="text-xs text-slate-500">Updated recently</span>
            </CardHeader>
            <CardContent className="p-0">
              <div className="relative pl-8 pr-6 pb-6 before:absolute before:left-11 before:top-4 before:bottom-4 before:w-px before:bg-slate-800">
                
                {milestones.length === 0 && (
                  <div className="py-8 text-center text-sm text-slate-500">
                    No milestones created yet.
                  </div>
                )}

                {milestones.map((milestone, idx) => (
                  <div key={milestone._id} className="relative mb-8 last:mb-0 pt-2">
                    {/* Timeline icon */}
                    <div className="absolute -left-10 mt-1 flex h-6 w-6 items-center justify-center rounded-full border border-slate-800 bg-[#0B101E] z-10">
                      {milestone.status === 'approved' ? (
                        <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                      ) : milestone.status === 'in-progress' || milestone.status === 'completed' ? (
                        <div className="h-2 w-2 rounded-full bg-blue-500" />
                      ) : (
                        <Lock className="h-3 w-3 text-slate-600" />
                      )}
                    </div>

                    <div className={`rounded-lg border ${milestone.status === 'in-progress' || milestone.status === 'completed' ? 'border-blue-900/50 bg-blue-950/20' : 'border-transparent'} p-4 -mt-3`}>
                      <div className="flex justify-between items-start mb-1">
                        <div className="text-xs font-semibold uppercase tracking-wider flex items-center">
                          {milestone.status === 'approved' && <span className="text-emerald-500">Completed</span>}
                          {milestone.status === 'in-progress' && <span className="text-blue-400">In Progress • Funded</span>}
                          {milestone.status === 'completed' && <span className="text-blue-400">Reviewing • Funded</span>}
                          {milestone.status === 'pending' && <span className="text-slate-500">Locked</span>}
                        </div>
                        <div className="text-sm font-medium text-slate-300">${milestone.amount.toLocaleString()}</div>
                      </div>
                      
                      <h4 className={`text-base font-medium mb-2 ${milestone.status === 'pending' ? 'text-slate-500' : 'text-slate-200'}`}>
                        {milestone.title}
                      </h4>
                      
                      {milestone.status === 'in-progress' && isFreelancer && (
                        <div className="mt-4 flex space-x-3">
                          <Button size="sm" className="bg-blue-600/20 text-blue-400 hover:bg-blue-600 hover:text-white border-none">
                            Submit for Review
                          </Button>
                        </div>
                      )}

                      {milestone.status === 'completed' && isClient && (
                        <div className="mt-4 flex space-x-3">
                          <Button size="sm" className="bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600 hover:text-white border-none">
                            Approve & Release Funds
                          </Button>
                        </div>
                      )}
                      
                      {milestone.status === 'pending' && isClient && contract.status === 'active' && (
                        <div className="mt-4 flex space-x-3">
                          <Button size="sm" className="bg-blue-600/20 text-blue-400 hover:bg-blue-600 hover:text-white border-none">
                            Fund Escrow
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}

              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
