import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "Fake Address Generator - Real Random Identities",
	description: "Generate valid fake addresses, random identities, credit cards, and user profiles for testing and development. Supports 50+ countries.",
    keywords: ["fake address", "random identity", "mock data", "testing", "developer tools"],
    authors: [{ name: "FakeAG" }],
    icons: {
        icon: "/favicon.svg",
    }
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen bg-muted/30`}>
                <SiteHeader />
                <main className="flex-1">
				    {children}
                </main>
                <SiteFooter />
                <Toaster />
			</body>
		</html>
	);
}
