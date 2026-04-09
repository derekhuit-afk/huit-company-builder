import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Huit.AI Company Builder — Build Your Platform in 45 Hours",
  description: "From concept to live SaaS platform in 13 phases. Built from Alaska by Derek Huit — 18 years, $1B+ in production.",
  openGraph: { title: "Huit.AI Company Builder", description: "Your next company, built on a proven blueprint.", siteName: "Huit.AI" },
};
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&display=swap" rel="stylesheet" />
      </head>
      <body style={{ margin:0, padding:0, background:"#0A0A0B", color:"#F1F5F9", fontFamily:"Arial,sans-serif" }}>
        <style>{`
          :root {
            --obsidian:#0A0A0B; --charcoal:#111114; --slate:#1A1A20; --border:#1E1E24;
            --honey:#F5A623; --gold:#D4881A; --text-primary:#F1F5F9; --text-secondary:#CBD5E1;
            --text-muted:#94A3B8; --muted:#374151; --green:#10B981; --blue:#3B82F6; --purple:#8B5CF6;
          }
          *{box-sizing:border-box} a{color:inherit} button{font-family:Arial,sans-serif}
          @media(max-width:768px){.hide-mobile{display:none!important}}
        `}</style>
        {children}
      </body>
    </html>
  );
}
