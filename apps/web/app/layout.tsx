import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = { title: "Yella Out — Dubai, well chosen", description: "Curated plans worth leaving home for." };
export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="en"><body>{children}</body></html>; }
