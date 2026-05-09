"use client";

import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";
import { Contract } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function ContractsPage() {
  const { data: contracts, isLoading } = useQuery<Contract[]>({
    queryKey: ["contracts"],
    queryFn: async () => {
      const res = await api.get("/contracts");
      return res.data;
    },
  });

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">All Contracts</h1>
        <Button asChild className="bg-blue-600 hover:bg-blue-700">
          <Link href="/contracts/create">Create New Contract</Link>
        </Button>
      </div>

      <Card className="bg-slate-900/40 border-slate-800">
        <CardHeader className="flex flex-row items-center justify-between border-b border-slate-800/50 pb-4">
          <CardTitle className="text-lg">Contracts List</CardTitle>
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
                      contract.status === 'rejected' ? 'bg-red-500/10 text-red-400' :
                      'bg-slate-500/10 text-slate-400'
                    }`}>
                      {contract.status.replace(/_/g, ' ')}
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
    </div>
  );
}
