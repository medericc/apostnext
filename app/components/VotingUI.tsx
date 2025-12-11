'use client';

import { Player } from '../type/game';

interface VotingCardProps {
  player: Player;
  votes: number;
  isSelected: boolean;
  onVote: (playerId: string) => void;
  disabled?: boolean;
}

export function VotingCard({ 
  player, 
  votes, 
  isSelected, 
  onVote, 
  disabled = false 
}: VotingCardProps) {
  return (
    <div className={`
      relative p-4 rounded-xl border-2 transition-all duration-300
      ${isSelected 
        ? 'bg-yellow-600/20 border-yellow-400 scale-105' 
        : 'bg-slate-700/30 border-slate-600 hover:border-slate-400'
      }
      ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:scale-102'}
    `}
    onClick={() => !disabled && onVote(player.id)}
    >
      {/* Nom du joueur */}
      <div className="flex items-center justify-between mb-2">
        <span className="text-gray-200 font-semibold text-lg">{player.name}</span>
        {player.eliminated && (
          <span className="text-red-400 text-sm bg-red-400/10 px-2 py-1 rounded">Éliminé</span>
        )}
      </div>

      {/* Score et votes */}
      <div className="flex justify-between items-center text-sm">
        <span className="text-gray-200/70">
          Score: <span className="text-yellow-400">{player.score}</span>
        </span>
        
        {votes > 0 && (
          <div className="flex items-center space-x-1">
            <span className="text-yellow-400 font-bold">{votes}</span>
            <span className="text-gray-200/70">vote{votes > 1 ? 's' : ''}</span>
          </div>
        )}
      </div>

      {/* Bouton de vote */}
      {!player.eliminated && !disabled && (
        <button
          className={`w-full mt-3 py-2 px-4 rounded-lg font-semibold transition-colors ${
            isSelected
              ? 'bg-yellow-500 text-slate-900'
              : 'bg-slate-600 text-gray-200 hover:bg-slate-500'
          }`}
        >
          {isSelected ? '✓ VOTÉ' : 'VOTER'}
        </button>
      )}

      {/* Indicateur de sélection */}
      {isSelected && (
        <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
          <span className="text-slate-900 text-sm font-bold">✓</span>
        </div>
      )}
    </div>
  );
}