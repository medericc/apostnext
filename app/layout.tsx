import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { GameProvider } from "./components/GameContextProvider";
import { Analytics } from "@vercel/analytics/next";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "L'Apostat – Jeu Undercover Chrétien",
    template: "%s | L'Apostat"
  },

  description:
    "L'Apostat est un jeu d'infiltration chrétien où les joueurs doivent démasquer l'apostat caché. Une expérience sociale palpitante inspirée des jeux undercover.",

  keywords: [
    "jeu chrétien",
    "undercover chrétien",
    "jeu social",
    "jeu d'infiltration",
    "apostat",
    "jeu de société chrétien",
    "jeu en ligne chrétien",
    "jeu biblique",
    "L'Apostat",
    "jeu next js"
  ],

  authors: [{ name: "L'Apostat Team" }],
  creator: "L'Apostat Team",

  metadataBase: new URL("https://ton-domaine.com"),

  // Favicons
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/icon0.svg", type: "image/svg+xml" },
      { url: "/icon1.png", sizes: "32x32", type: "image/png" }
    ],
    apple: [{ url: "/apple-icon.png" }]
  },

  manifest: "/manifest.json",

  openGraph: {
    type: "website",
    url: "https://ton-domaine.com",
    title: "L'Apostat – Jeu Undercover Chrétien",
    description:
      "Jeu social et chrétien où vous devez trouver l'apostat infiltré.",
    siteName: "L'Apostat",
    images: [
      {
        url: "/preview.jpg",
        width: 1200,
        height: 630,
        alt: "L'Apostat - Jeu Undercover Chrétien"
      }
    ]
  },

  twitter: {
    card: "summary_large_image",
    title: "L'Apostat – Jeu Undercover Chrétien",
    description:
      "Une expérience sociale chrétienne où vous devez démasquer l'apostat infiltré.",
    images: ["/preview.jpg"]
  },

  themeColor: "#1e1b4b"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className={inter.className}>
        <GameProvider>
          <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
            <div className="container mx-auto px-4 py-6 max-w-4xl">
              {children}
            </div>
          </div>
        </GameProvider>
        <Analytics />
      </body>
    </html>
  );
}
