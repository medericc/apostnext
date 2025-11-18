'use client';

import Link from 'next/link';
import { useGameStore } from './lib/store';

export default function Home() {
  const { resetGame, players } = useGameStore();

  const handleNewGame = () => {
    resetGame();
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center max-w-2xl mx-auto">
        {/* En-tête */}
        <div className="mb-12">
          <h1 className="font-cinzel text-5xl md:text-6xl font-bold gold-text mb-4">
            L&apos;APOSTAT
          </h1>
          <div className="parchment-bg rounded-2xl p-6 gold-border">
            <p className="text-creme-200 text-lg md:text-xl leading-relaxed">
              ⚠️ Un ou deux intrus se cachent parmi vous...
              <br />
              👀 Démasquez-les avant qu&apos;ils ne vous piègent !
              <br />
              ⛪ 4 à 8 joueurs • 25 points pour gagner
            </p>
          </div>
        </div>

        {/* Statistiques rapides */}
        {players.length > 0 && (
          <div className="mb-8 p-4 bg-slate-800/50 rounded-lg gold-border">
            <p className="gold-text font-semibold">Partie en cours</p>
            <p className="text-creme-200">{players.length} joueurs</p>
          </div>
        )}

        {/* Boutons d'action */}
        <div className="space-y-4">
          <Link 
            href="/game" 
            onClick={handleNewGame}
            className="block w-full max-w-xs mx-auto"
          >
            <button className="w-full bg-gradient-to-r from-yellow-600 to-yellow-700 hover:from-yellow-500 hover:to-yellow-600 text-slate-900 font-bold py-4 px-8 rounded-xl text-lg transition-all duration-300 transform hover:scale-105 shadow-lg">
              🎮 NOUVELLE PARTIE
            </button>
          </Link>

          {players.length > 0 && (
            <Link href="/game" className="block w-full max-w-xs mx-auto">
              <button className="w-full bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-500 hover:to-slate-600 text-creme-200 font-bold py-4 px-8 rounded-xl text-lg transition-all duration-300 border border-yellow-600/50">
                ➕ REPRENDRE LA PARTIE
              </button>
            </Link>
          )}
        </div>

        {/* Instructions rapides */}
        <div className="mt-12 text-creme-200/80 text-sm max-w-md mx-auto">
          <p>📱 Conçu pour mobile • 🖥️ Parfait sur grand écran</p>
          <p className="mt-2">Votre progression est sauvegardée automatiquement</p>
        </div>
      </div>
    </div>
  );
}