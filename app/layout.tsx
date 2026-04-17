import type { Metadata, Viewport } from "next";

const SITE_URL = "https://huit.build";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0A0A0B",
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Huit.AI Company Builder — Build Your Platform in 45 Hours",
  description:
    "From concept to live SaaS platform in 13 phases. Built from Alaska by Derek Huit — 18 years, $1B+ in production.",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: "Huit.AI",
    title: "Huit.AI Company Builder — Build Your Platform in 45 Hours",
    description:
      "From concept to live SaaS platform in 13 phases. Built from Alaska by Derek Huit — 18 years, $1B+ in production.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Huit.AI Company Builder — Your Next Company. Built from Alaska.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Huit.AI Company Builder — Build Your Platform in 45 Hours",
    description:
      "From concept to live SaaS platform in 13 phases. Built from Alaska by Derek Huit.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: { icon: "/favicon.ico" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: "Huit.AI",
      url: SITE_URL,
      logo: `${SITE_URL}/og-image.png`,
      founder: {
        "@type": "Person",
        name: "Derek Huit",
        jobTitle: "Founder & CEO",
        identifier: "NMLS #203980",
      },
      address: {
        "@type": "PostalAddress",
        addressLocality: "Anchorage",
        addressRegion: "AK",
        addressCountry: "US",
      },
      email: "derekhuit@gmail.com",
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: "Huit.AI Company Builder",
      publisher: { "@id": `${SITE_URL}/#organization` },
      inLanguage: "en-US",
    },
    {
      "@type": "Service",
      name: "Huit.AI Company Builder",
      provider: { "@id": `${SITE_URL}/#organization` },
      areaServed: "US",
      description:
        "Full SaaS platform build in 13 phases — 31 pages, 35 API routes, payment, email lifecycle, compliance layer — delivered from a proven blueprint.",
    },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body style={{ margin: 0, padding: 0, background: "#0A0A0B", color: "#F1F5F9", fontFamily: "Arial,sans-serif" }}>
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
