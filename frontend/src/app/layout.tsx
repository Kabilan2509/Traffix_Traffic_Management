import type { Metadata } from "next";
import "./globals.css";
import React from "react";

export const metadata: Metadata = {
  title: "Traffix Portal v4.0 | Government Smart Traffic Command Platform",
  description: "Production-grade AI-Powered Smart Traffic Management and Predictive Traffic Intelligence System for Tamil Nadu. Real-time junction control, LSTM predictions, emergency corridors, sensor management, and RBAC.",
  keywords: "smart traffic, AI traffic management, government traffic portal, Tamil Nadu traffic, LSTM prediction, emergency corridors",
  icons: {
    icon: "/icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Initialize theme immediately to prevent flash */}
        <script dangerouslySetInnerHTML={{__html: `
          const themeKey = 'traffix-theme-preference';
          const darkClass = 'dark-mode';
          const saved = localStorage.getItem(themeKey);
          const dark = saved ? saved === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches;
          if (dark) document.documentElement.classList.add(darkClass);
        `}} suppressHydrationWarning/>
      </head>
      <body style={{ margin: 0, padding: 0, fontFamily: "'Inter', 'Outfit', sans-serif" }}>
        {children}
      </body>
    </html>
  );
}
