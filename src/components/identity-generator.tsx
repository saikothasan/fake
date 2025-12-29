"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { 
  RefreshCw, Copy, Check, MapPin, User, CreditCard, Globe, Mail, 
  History, Code, Smartphone, Download
} from "lucide-react"; 
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { locales } from "@/lib/locales";

// --- Types ---
interface IdentityData {
  fullName: string;
  firstName: string;
  lastName: string;
  gender: string;
  birthDate: string;
  email: string;
  phone: string;
  username: string;
  password: string;
  job: { company: string; title: string };
  address: { street: string; city: string; state: string; zipCode: string; country: string };
  finance: { creditCardNumber: string; creditCardExpiry: string; creditCardCvv: string; iban: string };
  internet: { ip: string; userAgent: string; uuid: string; mac: string };
}

interface IdentityGeneratorProps {
  initialLocale: string;
}

export function IdentityGenerator({ initialLocale }: IdentityGeneratorProps) {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);
  const [data, setData] = React.useState<IdentityData | null>(null);
  const [gender, setGender] = React.useState<string>("all");
  const [history, setHistory] = React.useState<IdentityData[]>([]);

  // --- Actions ---
  const fetchData = React.useCallback(async (overrideLocale?: string) => {
    setLoading(true);
    try {
      const localeToUse = overrideLocale || initialLocale;
      const params = new URLSearchParams({ locale: localeToUse });
      if (gender !== "all") params.append("gender", gender);

      const res = await fetch(`/api/identity?${params}`);
      if (!res.ok) throw new Error("Failed to fetch");
      
      const json: IdentityData = await res.json();
      setData(json);
      
      // Update History
      setHistory(prev => {
        const newHistory = [json, ...prev].slice(0, 10);
        localStorage.setItem("fakeag_history", JSON.stringify(newHistory));
        return newHistory;
      });

    } catch { 
      toast.error("Failed to generate identity");
    } finally {
      setLoading(false);
    }
  }, [initialLocale, gender]);

  // --- Effects ---
  
  // Load History on Mount
  React.useEffect(() => {
    const saved = localStorage.getItem("fakeag_history");
    if (saved) setHistory(JSON.parse(saved));
    fetchData(); // Initial fetch
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Keyboard Shortcuts
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
        e.preventDefault();
        fetchData();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [fetchData]);

  // --- Handlers ---
  const handleLocaleChange = (newLocale: string) => router.push(`/${newLocale}`);
  
  const copyJSON = () => {
    if(!data) return;
    navigator.clipboard.writeText(JSON.stringify(data, null, 2));
    toast.success("JSON copied to clipboard");
  };

  return (
    <div className="space-y-6">
      {/* --- Control Bar --- */}
      <div className="sticky top-4 z-30 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 p-4 rounded-xl border shadow-sm flex flex-col md:flex-row gap-4 justify-between items-center transition-all">
        
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <Select value={initialLocale} onValueChange={handleLocaleChange}>
            <SelectTrigger className="w-[200px] h-10 font-medium">
              <Globe className="w-4 h-4 mr-2 text-muted-foreground" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {locales.map((l) => (
                <SelectItem key={l.code} value={l.code}>{l.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={gender} onValueChange={setGender}>
            <SelectTrigger className="w-[130px] h-10">
              <User className="w-4 h-4 mr-2 text-muted-foreground" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Any Gender</SelectItem>
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="shrink-0" title="History">
                <History className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Recent Identities</SheetTitle>
              </SheetHeader>
              <div className="mt-4 space-y-4 overflow-y-auto max-h-[90vh]">
                {history.map((item, i) => (
                  <div 
                    key={i} 
                    onClick={() => setData(item)}
                    className="p-3 rounded-lg border bg-card hover:bg-accent cursor-pointer transition-colors text-sm"
                  >
                    <div className="font-semibold">{item.fullName}</div>
                    <div className="text-xs text-muted-foreground">{item.address.city}, {item.address.country}</div>
                  </div>
                ))}
                {history.length === 0 && <div className="text-center text-muted-foreground text-sm py-10">No history yet</div>}
              </div>
            </SheetContent>
          </Sheet>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                 <Button variant="outline" size="icon" onClick={copyJSON} disabled={!data}>
                    <Code className="h-4 w-4" />
                 </Button>
              </TooltipTrigger>
              <TooltipContent><p>Copy as JSON</p></TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <Button onClick={() => fetchData()} disabled={loading} size="lg" className="w-full md:w-auto shadow-md hover:shadow-lg transition-all active:scale-95">
            <RefreshCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            Generate <span className="hidden sm:inline ml-1 opacity-50 text-xs font-normal border border-primary-foreground/30 px-1 rounded">⌘⏎</span>
          </Button>
        </div>
      </div>

      {/* --- Main Content --- */}
      {data && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          
          {/* Left Column: Personal Info */}
          <div className="md:col-span-4 space-y-6">
            <Card className="overflow-hidden border-l-4 border-l-primary">
              <CardHeader className="bg-muted/30 pb-4">
                <CardTitle className="text-xl">{data.fullName}</CardTitle>
                <CardDescription className="flex items-center gap-2">
                    <User className="h-3 w-3" /> {data.gender} • {data.birthDate}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                 <CopyField label="Email" value={data.email} icon={<Mail className="h-3 w-3" />} />
                 <CopyField label="Phone" value={data.phone} icon={<Smartphone className="h-3 w-3" />} />
                 <div className="h-px bg-border my-2" />
                 <CopyField label="Job Title" value={data.job.title} />
                 <CopyField label="Company" value={data.job.company} />
              </CardContent>
            </Card>

            <Card>
               <CardHeader><CardTitle className="text-base flex items-center gap-2"><Globe className="h-4 w-4 text-primary"/> Online Profile</CardTitle></CardHeader>
               <CardContent className="space-y-3">
                 <CopyField label="Username" value={data.username} />
                 <CopyField label="Password" value={data.password} />
                 <CopyField label="IP" value={data.internet.ip} />
                 <CopyField label="User Agent" value={data.internet.userAgent} truncate />
               </CardContent>
            </Card>
          </div>

          {/* Middle Column: Address (Visual) */}
          <div className="md:col-span-4 space-y-6">
            <Card className="h-full flex flex-col">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <MapPin className="h-4 w-4 text-primary" /> Address
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1 space-y-5">
                <div className="p-4 bg-amber-50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/30 rounded-lg shadow-sm">
                   <div className="font-mono text-sm text-foreground/80 leading-relaxed">
                      {data.fullName}<br/>
                      {data.address.street}<br/>
                      <span className="font-semibold">{data.address.city}, {data.address.state} {data.address.zipCode}</span><br/>
                      {data.address.country}
                   </div>
                </div>
                <div className="grid grid-cols-1 gap-3">
                    <CopyField label="Street" value={data.address.street} />
                    <CopyField label="City" value={data.address.city} />
                    <div className="grid grid-cols-2 gap-3">
                        <CopyField label="State" value={data.address.state} />
                        <CopyField label="Zip" value={data.address.zipCode} />
                    </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column: Finance */}
          <div className="md:col-span-4 space-y-6">
             <Card className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white border-0 shadow-lg relative overflow-hidden">
                <div className="absolute top-0 right-0 p-32 bg-white/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
                <CardHeader>
                    <CardTitle className="flex items-center justify-between text-base">
                        <span>Credit Card</span>
                        <CreditCard className="h-5 w-5 opacity-70" />
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div>
                        <Label className="text-slate-400 text-[10px] uppercase tracking-wider">Card Number</Label>
                        <div className="font-mono text-xl tracking-widest mt-1 flex justify-between items-center group cursor-pointer" onClick={() => {navigator.clipboard.writeText(data.finance.creditCardNumber); toast.success("Copied")}}>
                            {data.finance.creditCardNumber}
                            <Copy className="h-3 w-3 opacity-0 group-hover:opacity-50 transition-opacity" />
                        </div>
                    </div>
                    <div className="flex justify-between">
                        <div>
                            <Label className="text-slate-400 text-[10px] uppercase">Expiry</Label>
                            <div className="font-mono text-lg">{data.finance.creditCardExpiry}</div>
                        </div>
                        <div>
                            <Label className="text-slate-400 text-[10px] uppercase">CVV</Label>
                            <div className="font-mono text-lg">{data.finance.creditCardCvv}</div>
                        </div>
                    </div>
                </CardContent>
             </Card>

             <Card>
                <CardHeader><CardTitle className="text-base">Banking</CardTitle></CardHeader>
                <CardContent>
                    <CopyField label="IBAN" value={data.finance.iban} />
                </CardContent>
             </Card>
          </div>

        </div>
      )}
    </div>
  );
}

// --- Sub-components ---

function CopyField({ label, value, icon, truncate }: { label: string, value: string, icon?: React.ReactNode, truncate?: boolean }) {
  const [copied, setCopied] = React.useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    toast.success(`${label} copied!`);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-1.5 group">
      <div className="flex items-center justify-between">
        <Label className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold flex items-center gap-1.5">
            {icon} {label}
        </Label>
      </div>
      <div className="flex gap-2 relative">
        <div 
            onClick={handleCopy}
            className={`flex-1 font-mono text-sm bg-muted/30 hover:bg-muted/50 border rounded-md px-3 py-2 cursor-pointer transition-colors flex items-center justify-between ${truncate ? "truncate" : ""}`}
            title={value}
        >
            <span className={truncate ? "truncate w-[90%]" : ""}>{value}</span>
            {copied ? <Check className="h-3.5 w-3.5 text-green-500 shrink-0" /> : <Copy className="h-3.5 w-3.5 text-muted-foreground/50 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />}
        </div>
      </div>
    </div>
  );
}
