"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import api from "@/lib/axios";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Search, Lightbulb, FileText, CheckCircle2 } from "lucide-react";

export default function CreateContractPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  // Mocking the candidate selection for this prototype
  const [freelancerId, setFreelancerId] = useState("6615b8109867c4b7914db239"); // You would normally search users
  const [totalAmount, setTotalAmount] = useState<number>(5000);

  const createMutation = useMutation({
    mutationFn: () => api.post("/contracts", {
      title,
      description,
      freelancerId,
      totalAmount
    }),
    onSuccess: (res) => {
      router.push(`/contracts/${res.data._id}`);
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description || !freelancerId || totalAmount <= 0) return;
    createMutation.mutate();
  };

  return (
    <div className="mx-auto max-w-6xl pb-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Contract Basics</h1>
        <p className="text-sm text-slate-400 max-w-2xl">
          Establish the core identity of your new project. High-clarity titles and descriptions ensure mutual trust between you and your candidate.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Left Column: Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            <div className="space-y-2">
              <Label htmlFor="title">Contract Title</Label>
              <Input
                id="title"
                placeholder="e.g. Senior Frontend Architecture Revamp"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="h-12"
              />
              <p className="text-xs text-slate-500">Keep it professional and descriptive (Min 15 characters).</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="candidate">Search Candidate</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3.5 h-4 w-4 text-slate-500" />
                <Input
                  id="candidate"
                  placeholder="Alexander"
                  className="pl-10 h-12"
                  defaultValue="Alexander Sterling"
                  readOnly
                />
              </div>
              
              {/* Mock Candidate Selection UI */}
              <div className="mt-2 rounded-xl border border-blue-500/50 bg-slate-900/50 p-4 flex items-center justify-between cursor-pointer">
                <div className="flex items-center">
                  <div className="h-10 w-10 overflow-hidden rounded-full mr-3 bg-slate-800">
                    <img src="https://ui-avatars.com/api/?name=Alexander+Sterling&background=0D8ABC&color=fff" alt="Avatar" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-white">Alexander Sterling</div>
                    <div className="text-xs text-slate-400">Principal Product Designer • $145/hr</div>
                  </div>
                </div>
                <CheckCircle2 className="h-5 w-5 text-blue-500" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount">Total Contract Amount ($)</Label>
              <Input
                id="amount"
                type="number"
                value={totalAmount}
                onChange={(e) => setTotalAmount(Number(e.target.value))}
                className="h-12"
                min="1"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Scope of Work</Label>
              <textarea
                id="description"
                className="flex w-full rounded-md border border-slate-800 bg-slate-900 px-3 py-2 text-sm ring-offset-background placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 text-slate-50 min-h-[150px] resize-y"
                placeholder="Describe the objectives, deliverables, and expectations for this contract..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Category</Label>
                <div className="flex h-12 w-full items-center justify-between rounded-md border border-slate-800 bg-slate-900 px-3 py-2 text-sm text-slate-300 opacity-70">
                  Software Development
                </div>
              </div>
              <div className="space-y-2">
                <Label>Contract Visibility</Label>
                <div className="flex h-12 w-full items-center justify-between rounded-md border border-slate-800 bg-slate-900 px-3 py-2 text-sm text-slate-300 opacity-70">
                  Private (Invite Only)
                </div>
              </div>
            </div>

            <div className="pt-4 flex justify-end gap-3 border-t border-slate-800/50 mt-8">
              <Button type="button" variant="ghost">Save Draft</Button>
              <Button type="submit" disabled={createMutation.isPending} className="bg-blue-600 hover:bg-blue-700">
                {createMutation.isPending ? "Creating..." : "Next Step"}
              </Button>
            </div>
          </form>
        </div>

        {/* Right Column: Expert Tip & Preview */}
        <div className="space-y-6">
          <Card className="bg-slate-900/40 border-slate-800">
            <CardContent className="p-6">
              <div className="flex items-center text-sm font-semibold text-blue-400 mb-3">
                <Lightbulb className="mr-2 h-4 w-4" /> EXPERT TIP
              </div>
              <p className="text-sm text-slate-300 mb-4 leading-relaxed">
                Clear scope documentation reduces dispute rates by <span className="text-emerald-400 font-medium">84%</span> on MileStack. We recommend listing at least 3 distinct milestones.
              </p>
              <Button variant="link" className="text-blue-500 p-0 h-auto text-sm">
                View Contract Templates <span className="ml-1">↗</span>
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/40 border-slate-800">
            <div className="px-6 py-4 border-b border-slate-800/50">
              <h3 className="text-sm font-medium">Contract Preview</h3>
            </div>
            <CardContent className="p-6 space-y-6">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="text-xl font-semibold text-white mb-1 line-clamp-2">
                    {title || "Untitled Contract"}
                  </h4>
                  <div className="text-xs font-semibold uppercase tracking-wider text-emerald-500">
                    Draft • In Progress
                  </div>
                </div>
                <div className="h-10 w-10 bg-slate-800 rounded flex items-center justify-center border border-slate-700">
                  <FileText className="h-5 w-5 text-slate-400" />
                </div>
              </div>

              <div className="rounded border border-slate-800 bg-[#0B101E] p-3 flex items-center">
                <div className="h-8 w-8 overflow-hidden rounded mr-3 bg-slate-800">
                  <img src="https://ui-avatars.com/api/?name=Alexander+Sterling&background=0D8ABC&color=fff" alt="Avatar" />
                </div>
                <div>
                  <div className="text-xs text-slate-500">Candidate</div>
                  <div className="text-sm font-medium text-slate-200">Alexander Sterling</div>
                </div>
              </div>

              <div>
                <h5 className="text-xs text-slate-500 mb-3">Financial Terms</h5>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Rate</span>
                    <span className="text-slate-200">$145.00 / hr</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Billing Cycle</span>
                    <span className="text-slate-200">Bi-weekly</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Escrow Protection</span>
                    <span className="flex items-center text-emerald-500 text-xs font-medium">
                      <CheckCircle2 className="mr-1 h-3 w-3" /> Verified
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800/50 flex justify-between items-end">
                <span className="text-sm text-slate-400">Estimated Total</span>
                <span className="text-2xl font-bold text-white">${totalAmount.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
