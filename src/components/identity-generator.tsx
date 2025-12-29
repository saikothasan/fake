"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { 
  RefreshCw, Copy, Check, MapPin, User, CreditCard, Globe, Mail, 
  History, Code, Smartphone, Briefcase, Car, Plane, Wallet
} from "lucide-react"; 
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";
import { locales } from "@/lib/locales";

// --- Extended Type Definition ---
interface IdentityData {
  personal: {
    fullName: string;
    firstName: string;
    lastName: string;
    gender: string;
    bio: string;
    birthDate: string;
    zodiac: string;
  };
  contact: {
    email: string;
    phone: string;
  };
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    timeZone: string;
    coordinates: { lat: number; lng: number };
  };
  job: {
    company: string;
    title: string;
    descriptor: string;
    area: string;
  };
  finance: {
    creditCardNumber: string;
    creditCardExpiry: string;
    creditCardCvv: string;
    iban: string;
    bitcoin: string;
    ethereum: string;
    currency: string;
  };
  internet: {
    username: string;
    password: string;
    ip: string;
    mac: string;
    userAgent: string;
    uuid: string;
    domain: string;
  };
  vehicle: {
    model: string;
    type: string;
    vin: string;
    fuel: string;
  };
  travel: {
    airline: string;
    airport: string;
  };
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

  React.useEffect(() => {
    const saved = localStorage.getItem("fakeag_history");
    if (saved) setHistory(JSON.parse(saved));
    fetchData();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

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

  const handleLocaleChange = (newLocale: string) => router.push(`/${newLocale}`);
  
  const copyJSON = () => {
    if(!data) return;
    navigator.clipboard.writeText(JSON.stringify(data, null, 2));
    toast.success("JSON copied to clipboard");
  };

  return (
    <div className="space-y-6">
      {/* --- Control Bar --- */}
      <div className="sticky top-4 z-30 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 p-3 md:p-4 rounded-xl border shadow-sm flex flex-col md:flex-row gap-4 justify-between items-center transition-all">
        
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
          <Select value={initialLocale} onValueChange={handleLocaleChange}>
            <SelectTrigger className="w-full sm:w-[200px] h-10 font-medium">
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
            <SelectTrigger className="w-full sm:w-[130px] h-10">
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
              <div className="mt-4 space-y-3 overflow-y-auto max-h-[85vh] px-1">
                {history.map((item, i) => (
                  <div 
                    key={i} 
                    onClick={() => setData(item)}
                    className="p-3 rounded-lg border bg-card hover:bg-accent cursor-pointer transition-colors text-sm shadow-sm"
                  >
                    <div className="font-semibold">{item.personal.fullName}</div>
                    <div className="text-xs text-muted-foreground">{item.address.city}, {item.address.country}</div>
                  </div>
                ))}
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
              <TooltipContent><p>Copy JSON</p></TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <Button onClick={() => fetchData()} disabled={loading} size="lg" className="w-full md:w-auto shadow-md hover:shadow-lg transition-all active:scale-95">
            <RefreshCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            Generate <span className="hidden sm:inline ml-1 opacity-50 text-xs font-normal border border-primary-foreground/30 px-1 rounded">⌘⏎</span>
          </Button>
        </div>
      </div>

      {/* --- Main Content Grid --- */}
      {data && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          
          {/* --- Column 1: Identity & Work --- */}
          <div className="space-y-6">
            <Card className="overflow-hidden border-l-4 border-l-primary h-auto">
              <CardHeader className="bg-muted/30 pb-4">
                <CardTitle className="text-xl md:text-2xl">{data.personal.fullName}</CardTitle>
                <CardDescription className="flex items-center gap-2 flex-wrap">
                    <span className="flex items-center gap-1"><User className="h-3 w-3" /> {data.personal.gender}</span>
                    <span className="opacity-50">•</span>
                    <span>{data.personal.birthDate}</span>
                    <span className="opacity-50">•</span>
                    <span>{data.personal.zodiac}</span>
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                 <CopyField label="Email" value={data.contact.email} icon={<Mail className="h-3 w-3" />} />
                 <CopyField label="Phone" value={data.contact.phone} icon={<Smartphone className="h-3 w-3" />} />
                 <div className="bg-muted/30 p-3 rounded-md text-xs italic text-muted-foreground leading-relaxed">
                    &quot;{data.personal.bio}&quot;
                 </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                    <Briefcase className="h-4 w-4 text-primary"/> Employment
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <CopyField label="Company" value={data.job.company} />
                <CopyField label="Job Title" value={data.job.title} />
                <CopyField label="Department" value={data.job.area} />
                <div className="text-xs text-muted-foreground">{data.job.descriptor}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                    <Car className="h-4 w-4 text-primary"/> Vehicle
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                    <CopyField label="Model" value={data.vehicle.model} />
                    <CopyField label="Type" value={data.vehicle.type} />
                </div>
                <CopyField label="VIN" value={data.vehicle.vin} />
                <CopyField label="Fuel" value={data.vehicle.fuel} />
              </CardContent>
            </Card>
          </div>

          {/* --- Column 2: Address & Internet --- */}
          <div className="space-y-6">
            <Card className="h-auto">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <MapPin className="h-4 w-4 text-primary" /> Location
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-amber-50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/30 rounded-lg shadow-sm">
                   <div className="font-mono text-sm text-foreground/80 leading-relaxed">
                      {data.personal.fullName}<br/>
                      {data.address.street}<br/>
                      <span className="font-semibold">{data.address.city}, {data.address.state} {data.address.zipCode}</span><br/>
                      {data.address.country}
                   </div>
                </div>
                <CopyField label="TimeZone" value={data.address.timeZone} />
                <div className="grid grid-cols-2 gap-3">
                   <CopyField label="Latitude" value={data.address.coordinates.lat.toString()} />
                   <CopyField label="Longitude" value={data.address.coordinates.lng.toString()} />
                </div>
              </CardContent>
            </Card>

             <Card>
               <CardHeader className="pb-3"><CardTitle className="text-base flex items-center gap-2"><Globe className="h-4 w-4 text-primary"/> Digital Fingerprint</CardTitle></CardHeader>
               <CardContent className="space-y-3">
                 <CopyField label="Username" value={data.internet.username} />
                 <CopyField label="Password" value={data.internet.password} />
                 <div className="grid grid-cols-2 gap-3">
                     <CopyField label="IP Address" value={data.internet.ip} />
                     <CopyField label="MAC" value={data.internet.mac} />
                 </div>
                 <CopyField label="Domain" value={data.internet.domain} />
                 <CopyField label="UUID" value={data.internet.uuid} />
                 <CopyField label="User Agent" value={data.internet.userAgent} truncate />
               </CardContent>
            </Card>
          </div>

          {/* --- Column 3: Finance & Extras --- */}
          <div className="space-y-6">
             <Card className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 text-white border-0 shadow-lg relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-32 bg-white/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none transition-all group-hover:bg-white/10"></div>
                <CardHeader className="pb-4">
                    <CardTitle className="flex items-center justify-between text-base">
                        <span className="font-medium tracking-wide">Credit Card</span>
                        <CreditCard className="h-5 w-5 opacity-70" />
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div>
                        <Label className="text-slate-400 text-[10px] uppercase tracking-wider font-semibold">Card Number</Label>
                        <div className="font-mono text-xl md:text-2xl tracking-widest mt-1 flex justify-between items-center cursor-pointer hover:text-primary-foreground/80 transition-colors" onClick={() => {navigator.clipboard.writeText(data.finance.creditCardNumber); toast.success("Copied")}}>
                            {data.finance.creditCardNumber}
                        </div>
                    </div>
                    <div className="flex justify-between relative z-10">
                        <div>
                            <Label className="text-slate-400 text-[10px] uppercase">Expires</Label>
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
                <CardHeader className="pb-3"><CardTitle className="text-base flex items-center gap-2"><Wallet className="h-4 w-4 text-primary"/> Crypto & Bank</CardTitle></CardHeader>
                <CardContent className="space-y-3">
                    <CopyField label="IBAN" value={data.finance.iban} />
                    <Separator className="my-2"/>
                    <CopyField label="Bitcoin" value={data.finance.bitcoin} icon={<span className="text-xs font-bold">₿</span>} />
                    <CopyField label="Ethereum" value={data.finance.ethereum} icon={<span className="text-xs font-bold">Ξ</span>} />
                    <CopyField label="Currency" value={data.finance.currency} />
                </CardContent>
             </Card>

             <Card>
                <CardHeader className="pb-3"><CardTitle className="text-base flex items-center gap-2"><Plane className="h-4 w-4 text-primary"/> Travel Profile</CardTitle></CardHeader>
                <CardContent className="space-y-3">
                    <CopyField label="Airline" value={data.travel.airline} />
                    <CopyField label="Home Airport" value={data.travel.airport} />
                </CardContent>
             </Card>
          </div>

        </div>
      )}
    </div>
  );
}

// --- Helper Component ---

function CopyField({ label, value, icon, truncate }: { label: string, value: string, icon?: React.ReactNode, truncate?: boolean }) {
  const [copied, setCopied] = React.useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    toast.success(`${label} copied!`);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-1 group/field">
      <div className="flex items-center justify-between">
        <Label className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold flex items-center gap-1.5">
            {icon} {label}
        </Label>
      </div>
      <div 
          onClick={handleCopy}
          className={`relative w-full font-mono text-sm bg-muted/20 hover:bg-muted/40 border border-transparent hover:border-border rounded-md px-3 py-2 cursor-pointer transition-all flex items-center justify-between ${truncate ? "truncate" : ""}`}
          title={value}
      >
          <span className={`${truncate ? "truncate w-[90%]" : ""} select-all`}>{value}</span>
          <div className="flex items-center">
            {copied ? <Check className="h-3.5 w-3.5 text-green-500 animate-in zoom-in" /> : <Copy className="h-3.5 w-3.5 text-muted-foreground/30 group-hover/field:text-muted-foreground/80 transition-colors" />}
          </div>
      </div>
    </div>
  );
}
