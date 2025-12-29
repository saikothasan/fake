import Link from "next/link";
import { locales } from "@/lib/locales";

export function SiteFooter() {
  // Show popular locales to save space
  const popularLocales = locales.filter(l => ["en_US", "de", "fr", "ja", "es", "ru", "zh_CN"].includes(l.code));

  return (
    <footer className="border-t py-6 md:py-0 bg-muted/20 mt-12">
      <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row px-4 md:px-8">
        <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
          Built by <span className="font-medium text-foreground">FakeAG</span>. 
          The source code is available on <a href="https://github.com" target="_blank" rel="noreferrer" className="font-medium underline underline-offset-4">GitHub</a>.
        </p>
        <div className="flex flex-wrap gap-4 text-xs text-muted-foreground justify-center">
            {popularLocales.map(l => (
                <Link key={l.code} href={`/${l.code}`} className="hover:underline hover:text-foreground">
                    {l.name}
                </Link>
            ))}
            <Link href="/en_US" className="hover:underline hover:text-foreground font-semibold">View All 50+</Link>
        </div>
      </div>
    </footer>
  );
}
