import { locales } from "@/lib/locales";
import { IdentityGenerator } from "@/components/identity-generator";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

export function generateStaticParams() {
  return locales.map((locale) => ({
    locale: locale.code,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    const currentLocale = locales.find((l) => l.code === locale);
    
    if (!currentLocale) return { title: "Page Not Found" };

    return {
        title: `Fake Address Generator ${currentLocale.name} - Random Identity`,
        description: `Generate a random ${currentLocale.name} address, phone number, and identity for testing. Valid formats for ${currentLocale.name} zip codes and states.`,
        alternates: {
            canonical: `/${locale}`,
        },
        openGraph: {
            title: `Fake Identity Generator - ${currentLocale.name}`,
            description: `Free developer tool to generate mock data for ${currentLocale.name}.`,
            type: "website",
        }
    };
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
    <div className="container mx-auto p-4 md:p-8 space-y-8">
        <div className="space-y-2 text-center md:text-left">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
            Fake Address Generator <span className="text-primary">{currentLocale.name}</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl">
            Instant, valid mock data for your projects. Includes address, finance, and internet profiles localized for {currentLocale.name}.
          </p>
        </div>
        
        <IdentityGenerator initialLocale={locale} />
    </div>
  );
}
