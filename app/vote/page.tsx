'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useGameStore } from '../lib/store';
import { VotingCard } from '../components/VotingUI';

export default function VotePage() {
  const router = useRouter();
  const { 
    players, 
    votes, 
    addVote, 
    eliminatePlayer,
    currentPair 
  } = useGameStore();
  
  const [selectedPlayer, setSelectedPlayer] = useState<string | null>(null);
  const [showResults, setShowResults] = useState(false);

  const activePlayers = players.filter(p => !p.eliminated);

  const handleVote = (playerId: string) => {
    if (selectedPlayer === playerId) {
      setSelectedPlayer(null);
    } else {
      setSelectedPlayer(playerId);
      addVote(playerId);
    }
  };

  const finishVoting = () => {
    if (!selectedPlayer) return;
    
    // Trouver le joueur avec le plus de votes
    let maxVotes = 0;
    let eliminatedPlayerId: string | null = null;

    Object.entries(votes).forEach(([playerId, voteCount]) => {
      if (voteCount > maxVotes) {
        maxVotes = voteCount;
        eliminatedPlayerId = playerId;
      }
    });

    if (eliminatedPlayerId) {
      eliminatePlayer(eliminatedPlayerId);
      setShowResults(true);
    }
  };

  // Redirection automatique si partie terminée
  useEffect(() => {
    const gameEnded = players.some(p => p.score >= 25) || 
                     activePlayers.length <= 2;
    
    if (gameEnded) {
      router.push('/results');
    }
  }, [players, activePlayers.length, router]);

  if (showResults) {
    const eliminatedPlayer = players.find(p => 
      Object.keys(votes).includes(p.id) && p.eliminated
    );

    if (!eliminatedPlayer) {
      router.push('/results');
      return null;
    }

    const wasApostat = eliminatedPlayer.role === 'apostat';
    
    return (
      <div className="min-h-screen flex items-center justify-center py-8">
        <div className="text-center max-w-2xl w-full">
          <div className="p-8 parchment-bg rounded-2xl gold-border">
            {/* Icône */}
            <div className="text-6xl mb-6">
              {wasApostat ? '🎯' : '⚰️'}
            </div>

            {/* Titre */}
            <h2 className="font-cinzel text-3xl gold-text mb-4">
              JUGEMENT RENDU
            </h2>

            {/* Résultat */}
            <div className="mb-6">
              <p className="text-creme-200 text-xl mb-2">{eliminatedPlayer.name}</p>
              <p className={`text-2xl font-bold ${wasApostat ? 'text-red-400' : 'text-yellow-400'}`}>
                était un {wasApostat ? 'APOSTAT' : 'FIDÈLE'}
              </p>
            </div>

            {/* Message */}
            <div className="p-4 bg-slate-800/50 rounded-lg mb-6">
              <p className="text-creme-200">
                {wasApostat 
                  ? '✅ Bien joué ! Les Fidèles ont éliminé un Apostat.'
                  : '❌ Oh non ! Les Fidèles ont éliminé un des leurs.'
                }
              </p>
            </div>

            {/* Bouton continuer */}
            <button
              onClick={() => router.push('/results')}
              className={`w-full max-w-xs py-4 px-8 rounded-xl font-bold text-lg transition-all duration-300 ${
                wasApostat
                  ? 'bg-green-600 hover:bg-green-500 text-white'
                  : 'bg-red-600 hover:bg-red-500 text-white'
              }`}
            >
              VOIR LES RÉSULTATS
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="text-center mb-8">
        <h1 className="font-cinzel text-4xl gold-text mb-4">
          ASSEMBLÉE DES FIDÈLES
        </h1>
        <p className="text-creme-200 text-lg">
          Choisissez qui bannir
        </p>
        <p className="text-creme-200/60 text-sm mt-2">
          Mot des Fidèles: <span className="text-yellow-400">{currentPair?.fidele}</span>
        </p>
      </div>

      {/* Liste des joueurs à voter */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto mb-8">
        {activePlayers.map((player) => (
          <VotingCard
            key={player.id}
            player={player}
            votes={votes[player.id] || 0}
            isSelected={selectedPlayer === player.id}
            onVote={handleVote}
          />
        ))}
      </div>

      {/* Bouton de confirmation */}
      <div className="text-center">
        <button
          onClick={finishVoting}
          disabled={!selectedPlayer}
          className={`
            py-4 px-12 rounded-xl font-bold text-lg transition-all duration-300
            ${selectedPlayer
              ? 'bg-yellow-600 hover:bg-yellow-500 text-slate-900 transform hover:scale-105'
              : 'bg-slate-600 text-creme-200/50 cursor-not-allowed'
            }
          `}
        >
          {selectedPlayer ? 'CONFIRMER LE VOTE →' : 'CHOISISSEZ UN JOUEUR'}
        </button>
      </div>

      {/* Instructions */}
      <div className="text-center mt-8 max-w-2xl mx-auto">
        <div className="p-4 bg-slate-800/30 rounded-lg">
          <p className="text-creme-200/70 text-sm">
            💡 Discutez entre vous pour trouver les incohérences dans les indices donnés
          </p>
        </div>
      </div>
    </div>
  );
}