'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useGameStore } from '../lib/store';

export default function PlayPage() {
  const router = useRouter();
  const { players, currentPair } = useGameStore();
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [showWord, setShowWord] = useState(false);

  const currentPlayer = players[currentPlayerIndex];
  const isLastPlayer = currentPlayerIndex === players.length - 1;

  const handleReveal = () => {
    setShowWord(true);
  };

  const handleNext = () => {
    if (isLastPlayer) {
      router.push('/vote');
    } else {
      setCurrentPlayerIndex(prev => prev + 1);
      setShowWord(false);
    }
  };

  if (!currentPair || !currentPlayer) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-200">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-8">
      <div className="w-full max-w-2xl text-center">
        {/* En-tête */}
        <div className="mb-8">
          <h1 className="font-cinzel text-4xl gold-text mb-2">
            Révélation des Rôles
          </h1>
          <p className="text-gray-200 text-lg">
            Passe le téléphone à {currentPlayer.name}
          </p>
          <div className="mt-4 flex justify-center space-x-2">
            {players.map((_, index) => (
              <div
                key={index}
                className={`w-3 h-3 rounded-full ${
                  index === currentPlayerIndex
                    ? 'bg-yellow-400'
                    : index < currentPlayerIndex
                    ? 'bg-green-400'
                    : 'bg-slate-600'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Carte du mot */}
        <div className="mb-8">
          <div
            onClick={!showWord ? handleReveal : undefined}
            className={`cursor-${!showWord ? 'pointer' : 'default'} transition-all duration-500`}
          >
            {!showWord ? (
              <div className="p-12 parchment-bg rounded-2xl gold-border hover:scale-105 transition-transform">
                <div className="text-6xl mb-6">🎴</div>
                <p className="text-gray-200 text-xl mb-4">Touche pour révéler ta carte</p>
                <p className="text-gray-200/60 text-sm">
                  {currentPlayer.name}, regarde ton mot sans le montrer aux autres
                </p>
              </div>
            ) : (
              <div className="p-8 parchment-bg rounded-2xl gold-border">
                <p className="text-gray-200/70 text-lg mb-4">TON MOT SACRÉ</p>
                <p className="text-4xl font-bold gold-text mb-4">
                  {currentPlayer.role === 'apostat' ? currentPair.apostat : currentPair.fidele}
                </p>
                {currentPlayer.role === 'apostat' && (
                  <p className="text-red-400 text-lg font-semibold">(Apostat)</p>
                )}
                <div className="mt-6 p-4 bg-slate-800/50 rounded-lg">
                  <p className="text-gray-200/60 text-sm">
                    {currentPlayer.role === 'apostat' 
                      ? "Fais deviner ce mot sans te faire repérer !"
                      : "Les autres Fidèles ont le même mot que toi"
                    }
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Bouton suivant */}
        {showWord && (
          <button
            onClick={handleNext}
            className="bg-gradient-to-r from-yellow-600 to-yellow-700 hover:from-yellow-500 hover:to-yellow-600 text-slate-900 font-bold py-4 px-8 rounded-xl text-lg transition-all duration-300 transform hover:scale-105 w-full max-w-xs"
          >
            {isLastPlayer ? 'PROCÉDER AU VOTE →' : 'SUIVANT →'}
          </button>
        )}
      </div>
    </div>
  );
}