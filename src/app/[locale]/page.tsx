import { locales } from "@/lib/locales";
import { IdentityGenerator } from "@/components/identity-generator";
import { notFound } from "next/navigation";
import { Toaster } from "@/components/ui/sonner";

// Pre-generate static params for all supported locales for better performance
export function generateStaticParams() {
  return locales.map((locale) => ({
    locale: locale.code,
  }));
}

export default async function CountryPage({ 
  params 
}: { 
  params: Promise<{ locale: string }> 
}) {
  const { locale } = await params;
  const currentLocale = locales.find((l) => l.code === locale);

  if (!currentLocale) {
    return notFound();
  }

  return (
    <div className="min-h-screen bg-muted/30 p-4 md:p-8 font-sans">
      <div className="max-w-6xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Fake Address Generator - {currentLocale.name}
          </h1>
          <p className="text-muted-foreground mt-2 text-lg">
            Generate random identity data localized for {currentLocale.name}.
          </p>
        </div>
        
        <IdentityGenerator initialLocale={locale} />
      </div>
      <Toaster />
    </div>
  );
}
