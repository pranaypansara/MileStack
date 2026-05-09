import { Card, CardContent } from "@/components/ui/card";
import { Wrench } from "lucide-react";

export default function SettingsConstructionPage() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <Card className="bg-slate-900/40 border-slate-800 w-full max-w-md">
        <CardContent className="flex flex-col items-center justify-center p-12 text-center">
          <div className="mb-4 rounded-full bg-blue-500/10 p-4 text-blue-500">
            <Wrench className="h-10 w-10" />
          </div>
          <h2 className="mb-2 text-2xl font-bold text-white">Under Construction</h2>
          <p className="text-slate-400 text-sm">
            We are currently building the Settings feature. Check back soon!
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
