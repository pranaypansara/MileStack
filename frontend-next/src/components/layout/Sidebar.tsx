"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  FileText, 
  CreditCard, 
  Flag, 
  MessageSquare, 
  Settings, 
  HelpCircle, 
  LogOut,
  FlagIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useContext } from "react";
import { AuthContext } from "@/context/AuthContext";

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Contracts", href: "/contracts", icon: FileText },
  { name: "Payments", href: "/payments", icon: CreditCard },
  { name: "Milestones", href: "/milestones", icon: Flag },
  { name: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const { logout } = useContext(AuthContext);

  return (
    <div className="flex h-screen w-64 flex-col border-r border-slate-800 bg-[#0B101E] px-4 py-6 text-slate-300">
      <div className="mb-8 flex items-center px-2">
        <div className="mr-3 flex h-8 w-8 items-center justify-center rounded bg-blue-600 text-white">
          <FlagIcon className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-white leading-tight">MileStack</h2>
          <p className="text-xs text-slate-500">Freelance Hub</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-blue-600 text-white"
                  : "text-slate-400 hover:bg-slate-800 hover:text-white"
              )}
            >
              <item.icon className={cn("mr-3 h-5 w-5", isActive ? "text-white" : "text-slate-400")} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto pt-6 space-y-4">
        <Button asChild className="w-full bg-blue-600/20 text-blue-400 hover:bg-blue-600 hover:text-white border-none justify-start px-4 h-11 shadow-none">
          <Link href="/contracts/create">
            Create Contract
          </Link>
        </Button>
        
        <div className="space-y-1 pt-2">
          <Link href="/support" className="flex items-center rounded-lg px-3 py-2 text-sm font-medium text-slate-400 hover:bg-slate-800 hover:text-white transition-colors">
            <HelpCircle className="mr-3 h-5 w-5 text-slate-400" />
            Support
          </Link>
          <button 
            onClick={logout}
            className="flex w-full items-center rounded-lg px-3 py-2 text-sm font-medium text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
          >
            <LogOut className="mr-3 h-5 w-5 text-slate-400" />
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
