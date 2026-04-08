import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, IBM_Plex_Sans, IBM_Plex_Mono } from "next/font/google";
import ChatBot from "@/components/ui/ChatBot";
import ScrollToTopButton from "@/components/ui/ScrollToTopButton";
import FilmGrain from "@/components/ui/FilmGrain";
import ClickSparkLayer from "@/components/ui/ClickSparkLayer";
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

const ibmPlexSans = IBM_Plex_Sans({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

const SITE_URL = "https://bizzzup.com";
const SITE_NAME = "Bizzzup AI Labs";
const TITLE = "Bizzzup AI Labs — Shaping the Future of AI";
const DESCRIPTION =
  "Bizzzup AI Labs builds multi-agent systems, RAG platforms, AI chatbots, creative pipelines, and production automation — from Chennai to the world.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: TITLE,
    template: `%s | ${SITE_NAME}`,
  },
  description: DESCRIPTION,
  keywords: [
    "AI Labs",
    "multi-agent systems",
    "RAG platform",
    "AI chatbots",
    "production automation",
    "creative pipelines",
    "artificial intelligence",
    "Chennai AI",
    "Bizzzup",
  ],
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
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
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: TITLE,
    description: DESCRIPTION,
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Bizzzup AI Labs — Shaping the Future of AI",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    creator: "@bizzzup",
    site: "@bizzzup",
    images: ["/opengraph-image"],
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: SITE_NAME,
      url: SITE_URL,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/logo-bizzzup.png`,
        width: 200,
        height: 60,
      },
      description: DESCRIPTION,
      foundingLocation: {
        "@type": "Place",
        name: "Chennai, India",
      },
      sameAs: [
        "https://linkedin.com/company/bizzzup",
        "https://x.com/bizzzup",
        "https://github.com/bizzzup",
      ],
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "customer service",
        email: "hello@bizzzup.com",
        telephone: "+919003020030",
        availableLanguage: "English",
      },
    },
    {
      "@type": "LocalBusiness",
      "@id": `${SITE_URL}/#localbusiness`,
      name: SITE_NAME,
      url: SITE_URL,
      description: DESCRIPTION,
      address: {
        "@type": "PostalAddress",
        addressLocality: "Chennai",
        addressRegion: "Tamil Nadu",
        addressCountry: "IN",
      },
      priceRange: "$$",
      image: `${SITE_URL}/og-image.png`,
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: SITE_NAME,
      description: DESCRIPTION,
      publisher: {
        "@id": `${SITE_URL}/#organization`,
      },
      potentialAction: {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: `${SITE_URL}/?q={search_term_string}`,
        },
        "query-input": "required name=search_term_string",
      },
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${plusJakarta.variable} ${ibmPlexSans.variable} ${ibmPlexMono.variable} relative antialiased`}
      >
        <div className="site-root">
          <FilmGrain />
          <ClickSparkLayer />
          {children}
          <ScrollToTopButton />
          <ChatBot />
        </div>
      </body>
    </html>
  );
}
