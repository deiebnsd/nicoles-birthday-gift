import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://pantryful-recipes.daffe.chatgpt.site"),
  title: "Nicole's birthday gift",
  description: "Hopefully recipes you actually want to cook.",
  openGraph: {
    title: "Nicole's birthday gift",
    description: "Hopefully recipes you actually want to cook.",
    type: "website",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Nicole's birthday gift" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Nicole's birthday gift",
    description: "Hopefully recipes you actually want to cook.",
    images: ["/og.png"],
  },
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" data-theme="pink"><body>{children}</body></html>;
}
