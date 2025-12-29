import Link from "next/link";
import { VenetianMask } from "lucide-react"; 

export function SiteHeader() {
  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-40">
      <div className="container flex h-14 items-center px-4 md:px-8">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <VenetianMask className="h-6 w-6" />
          <span className="font-bold inline-block">FakeAG</span>
        </Link>
        <nav className="flex items-center space-x-6 text-sm font-medium">
          <Link href="/en_US" className="transition-colors hover:text-foreground/80 text-foreground/60">Generator</Link>
          <a href="https://github.com" target="_blank" rel="noreferrer" className="transition-colors hover:text-foreground/80 text-foreground/60">GitHub</a>
        </nav>
      </div>
    </header>
  );
}
