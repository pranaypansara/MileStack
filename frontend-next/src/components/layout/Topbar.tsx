"use client";

import { Search, Bell, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function Topbar() {
  return (
    <div className="flex h-16 items-center justify-between border-b border-slate-800 bg-[#0B101E] px-8 py-3">
      <div className="flex flex-1 items-center gap-8">
        <div className="relative w-96">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
          <Input
            type="text"
            placeholder="Search contracts or milestones..."
            className="h-9 w-full rounded-full border-slate-700 bg-slate-800/50 pl-10 pr-4 text-sm focus-visible:ring-1 focus-visible:ring-slate-500"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Button variant="default" size="sm" className="h-8 rounded-full px-4 text-xs">
          Withdraw Funds
        </Button>
        <button className="text-slate-400 hover:text-white transition-colors">
          <Bell className="h-5 w-5" />
        </button>
        <button className="text-slate-400 hover:text-white transition-colors">
          <HelpCircle className="h-5 w-5" />
        </button>
        <div className="h-8 w-8 overflow-hidden rounded-full border border-slate-700 bg-slate-800">
          <img src="https://ui-avatars.com/api/?name=User&background=0D8ABC&color=fff" alt="User Avatar" />
        </div>
      </div>
    </div>
  );
}
