"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { 
  RefreshCw, 
  Copy, 
  Check, 
  MapPin, 
  User, 
  CreditCard, 
  Globe, 
  Mail
} from "lucide-react"; // Removed unused 'Phone'
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { locales } from "@/lib/locales";

// Define the exact shape of the API response to avoid 'any'
interface IdentityData {
  fullName: string;
  gender: string;
  birthDate: string;
  email: string;
  phone: string;
  username: string;
  password: string;
  job: {
    company: string;
    title: string;
  };
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  finance: {
    creditCardNumber: string;
    creditCardExpiry: string;
    creditCardCvv: string;
    iban: string;
  };
  internet: {
    ip: string;
    userAgent: string;
    uuid: string;
  };
}

interface IdentityGeneratorProps {
  initialLocale: string;
}

export function IdentityGenerator({ initialLocale }: IdentityGeneratorProps) {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);
  // Replaced <any> with <IdentityData | null>
  const [data, setData] = React.useState<IdentityData | null>(null);
  const [gender, setGender] = React.useState<string>("all");

  const fetchData = React.useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ locale: initialLocale });
      if (gender !== "all") params.append("gender", gender);

      const res = await fetch(`/api/identity?${params}`);
      if (!res.ok) throw new Error("Failed to fetch");
      
      const json: IdentityData = await res.json();
      setData(json);
    } catch { 
      // Removed unused 'error' variable
      toast.error("Failed to generate identity");
    } finally {
      setLoading(false);
    }
  }, [initialLocale, gender]);

  React.useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleLocaleChange = (newLocale: string) => {
    router.push(`/${newLocale}`);
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-card p-4 rounded-xl border shadow-sm">
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">Country / Locale</Label>
            <Select value={initialLocale} onValueChange={handleLocaleChange}>
              <SelectTrigger className="w-[200px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {locales.map((l) => (
                  <SelectItem key={l.code} value={l.code}>
                    {l.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">Gender</Label>
            <Select value={gender} onValueChange={setGender}>
              <SelectTrigger className="w-[120px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Any</SelectItem>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Button onClick={fetchData} disabled={loading} size="lg" className="w-full md:w-auto">
          <RefreshCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          Generate Identity
        </Button>
      </div>

      {/* Results Grid */}
      {data && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Identity Column */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5 text-primary" />
                  Personal
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <CopyField label="Full Name" value={data.fullName} />
                <div className="grid grid-cols-2 gap-4">
                  <CopyField label="Gender" value={data.gender} />
                  <CopyField label="Birthday" value={data.birthDate} />
                </div>
                <CopyField label="Company" value={data.job.company} />
                <CopyField label="Job Title" value={data.job.title} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5 text-primary" />
                  Online
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <CopyField label="Username" value={data.username} />
                <CopyField label="Password" value={data.password} />
                <CopyField label="IP Address" value={data.internet.ip} />
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">User Agent</Label>
                  <p className="text-xs bg-muted p-2 rounded border break-all font-mono">
                    {data.internet.userAgent}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Address Column */}
          <div className="space-y-6">
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-primary" />
                  Address
                </CardTitle>
                <CardDescription>Localized address format</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <CopyField label="Street" value={data.address.street} />
                <div className="grid grid-cols-2 gap-4">
                  <CopyField label="City" value={data.address.city} />
                  <CopyField label="State/Province" value={data.address.state} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <CopyField label="Zip/Postal" value={data.address.zipCode} />
                  <CopyField label="Country" value={data.address.country} />
                </div>
                
                <div className="mt-6 p-4 bg-muted/50 border border-dashed rounded-lg">
                   <Label className="text-xs text-muted-foreground mb-2 block">Formatted Label</Label>
                   <pre className="text-sm font-mono whitespace-pre-wrap">
                    {data.fullName}{"\n"}
                    {data.address.street}{"\n"}
                    {data.address.city}, {data.address.state} {data.address.zipCode}{"\n"}
                    {data.address.country}
                   </pre>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Finance Column */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-primary" />
                  Finance
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <CopyField label="Card Number" value={data.finance.creditCardNumber} />
                <div className="grid grid-cols-2 gap-4">
                  <CopyField label="Expires" value={data.finance.creditCardExpiry} />
                  <CopyField label="CVV" value={data.finance.creditCardCvv} />
                </div>
                <CopyField label="IBAN" value={data.finance.iban} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5 text-primary" />
                  Contact
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <CopyField label="Email" value={data.email} />
                <CopyField label="Phone" value={data.phone} />
              </CardContent>
            </Card>
          </div>

        </div>
      )}
    </div>
  );
}

function CopyField({ label, value }: { label: string, value: string }) {
  const [copied, setCopied] = React.useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    toast.success("Copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-1.5">
      <Label className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">{label}</Label>
      <div className="flex gap-2 relative group">
        <Input readOnly value={value} className="font-mono text-sm bg-muted/20 pr-10" />
        <Button 
          variant="ghost" 
          size="icon" 
          className="absolute right-0 top-0 h-9 w-9 text-muted-foreground hover:text-foreground"
          onClick={handleCopy}
        >
          {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
        </Button>
      </div>
    </div>
  );
}
