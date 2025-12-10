'use client';
import { Player } from '../type/game';
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
    phase,
  } = useGameStore();

  const [selectedPlayer, setSelectedPlayer] = useState<string | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [eliminatedPlayer, setEliminatedPlayer] = useState<Player | null>(null);

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
    // Vérifier si c'est une égalité
    const ties = Object.entries(votes).filter(([_, count]) => count === maxVotes);
    
    if (ties.length > 1) {
      alert("Égalité ! Revotez.");
      // Réinitialiser les votes
      Object.keys(votes).forEach(id => addVote(id)); // Cette logique est à revoir
      return;
    }

    eliminatePlayer(eliminatedPlayerId);
    
    // Trouver le joueur éliminé
    const eliminated = players.find(p => p.id === eliminatedPlayerId);
    if (eliminated) {
      setEliminatedPlayer(eliminated);
      setShowResults(true);
    }
  }
}; // <-- ICI, il manquait cette accolade fermante

  // 🔥 CORRECTION : Vérifier fin de partie
  useEffect(() => {
    if (phase === 'gameEnd') {
      router.push('/score');
      return;
    }

    // Vérifier fin de manche (MAIS ne pas rediriger automatiquement)
    const aliveApo = players.filter(p => p.role === 'apostat' && !p.eliminated);
    const aliveFid = players.filter(p => p.role === 'fidele' && !p.eliminated);
    
    const mancheTerminee = aliveApo.length === 0 || aliveFid.length === 0;
    
    if (mancheTerminee && !showResults) {
      // Si manche terminée mais on n'a pas encore montré les résultats
      // C'est eliminatePlayer qui doit gérer la transition
      console.log("Manche terminée, en attente de gestion...");
    }
  }, [players, phase, router, showResults]);

  if (showResults && eliminatedPlayer) {
    const wasApostat = eliminatedPlayer.role === 'apostat';
    
    // Vérifier si la manche est terminée après cette élimination
    const aliveApo = players.filter(p => 
      p.role === 'apostat' && !p.eliminated && p.id !== eliminatedPlayer.id
    );
    const aliveFid = players.filter(p => 
      p.role === 'fidele' && !p.eliminated && p.id !== eliminatedPlayer.id
    );
    
    const mancheTerminee = aliveApo.length === 0 || aliveFid.length === 0;

    return (
      <div className="min-h-screen flex items-center justify-center py-8">
        <div className="text-center max-w-2xl w-full">
          <div className="p-8 parchment-bg rounded-2xl gold-border">
            <div className="text-6xl mb-6">
              {wasApostat ? '🎯' : '⚰️'}
            </div>

            <h2 className="font-cinzel text-3xl gold-text mb-4">
              JUGEMENT RENDU
            </h2>

            <div className="mb-6">
              <p className="text-creme-200 text-xl mb-2">{eliminatedPlayer.name}</p>
              <p className={`text-2xl font-bold ${wasApostat ? 'text-red-400' : 'text-yellow-400'}`}>
                était un {wasApostat ? 'APOSTAT' : 'FIDÈLE'}
              </p>
            </div>

            <div className="p-4 bg-slate-800/50 rounded-lg mb-6">
              <p className="text-creme-200">
                {wasApostat 
                  ? '✅ Bien joué ! Les Fidèles ont éliminé un Apostat.'
                  : '❌ Oh non ! Les Fidèles ont éliminé un des leurs.'
                }
              </p>
              
              {/* Afficher le statut de la manche */}
              <div className="mt-4 p-3 bg-slate-700/30 rounded">
                <p className="text-creme-200/70 text-sm">
                  {mancheTerminee 
                    ? '🎯 Manche terminée !' 
                    : `📊 Apostats restants: ${aliveApo.length} | Fidèles restants: ${aliveFid.length}`
                  }
                </p>
              </div>
            </div>

            {/* BOUTON SUIVANT ADAPTÉ */}
            {mancheTerminee ? (
              // Si manche terminée, aller aux résultats
              <button
                onClick={() => {
                  // La manche est terminée, eliminatePlayer a déjà attribué les points
                  // On va à la page de score qui affichera les résultats
                  router.push('/score');
                }}
                className="w-full max-w-xs py-4 px-8 bg-gradient-to-r from-yellow-600 to-yellow-700 hover:from-yellow-500 hover:to-yellow-600 text-slate-900 font-bold rounded-xl text-lg transition-all duration-300"
              >
                📊 VOIR LES RÉSULTATS
              </button>
            ) : (
              // Sinon, continuer à voter
              <button
                onClick={() => {
                  setShowResults(false);
                  setSelectedPlayer(null);
                  setEliminatedPlayer(null);
                }}
                className="w-full max-w-xs py-4 px-8 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-bold rounded-xl text-lg transition-all duration-300"
              >
                ➡️ TOUR SUIVANT
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Écran de vote normal
  return (
    <div className="min-h-screen py-8">
      <div className="text-center mb-8">
        <h1 className="font-cinzel text-4xl gold-text mb-4">
          ASSEMBLÉE DES FIDÈLES
        </h1>
        <p className="text-yellow-400 text-lg">
          Choisissez qui bannir
        </p>
        <div className="mt-2 text-creme-200/70">
          Apostats restants: {players.filter(p => p.role === 'apostat' && !p.eliminated).length} • 
          Fidèles restants: {players.filter(p => p.role === 'fidele' && !p.eliminated).length}
        </div>
      </div>

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

      <div className="text-center">
        <button
          onClick={finishVoting}
          disabled={!selectedPlayer}
          className={`
            py-4 px-12 rounded-xl font-bold text-lg transition-all duration-300
            ${selectedPlayer
              ? 'bg-gradient-to-r from-yellow-600 to-yellow-700 hover:from-yellow-500 hover:to-yellow-600 text-slate-900 transform hover:scale-105'
              : 'bg-slate-600 text-creme-200/50 cursor-not-allowed'
            }
          `}
        >
          {selectedPlayer ? 'CONFIRMER LE VOTE →' : 'CHOISISSEZ UN JOUEUR'}
        </button>
      </div>

      <div className="text-center mt-8 max-w-2xl mx-auto">
        <div className="p-4 bg-slate-800/30 rounded-lg">
          <p className="text-creme-200/70 text-sm">
            💡 Discutez entre vous pour trouver les incohérences dans les indices donnés
          </p>
          <p className="text-creme-200/50 text-xs mt-2">
            Une manche continue jusqu&lsquo;à ce qu&lsquo;un camp soit entièrement éliminé
          </p>
        </div>
      </div>
    </div>
  );
} 