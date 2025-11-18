import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { GameProvider } from './components/GameContextProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: "L'Apostat - Jeu d'infiltration",
  description: 'Un jeu social où vous devez démasquer les apostats',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
      </body>
    </html>
  );
}