'use client';

import { useGameStore } from '../lib/store';

export function PlayerList() {
  const { players } = useGameStore();

  // Trier par score (décroissant)
  const sortedPlayers = [...players].sort((a, b) => b.score - a.score);

  if (players.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-200/60">Aucun joueur ajouté</p>
        <p className="text-sm text-gray-200/40 mt-2">
          Ajoutez des joueurs pour commencer
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {sortedPlayers.map((player, index) => (
        <div
          key={player.id}
          className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg border border-yellow-600/20 hover:border-yellow-600/40 transition-colors"
        >
          <div className="flex items-center space-x-4">
            {/* Position basée sur le score */}
            <div className={`
              w-8 h-8 flex items-center justify-center rounded-full font-semibold
              ${index === 0 ? 'bg-yellow-400 text-slate-900' : 
                index === 1 ? 'bg-slate-500 text-gray-200' : 
                index === 2 ? 'bg-amber-700 text-gray-200' : 
                'bg-slate-600 text-gray-200'}
            `}>
              {index + 1}
            </div>
            <span className="text-gray-200 font-medium">{player.name}</span>
          </div>
          
          <div className="text-right">
            <div className="text-gray-200/70 text-sm">
              Score: <span className="text-yellow-400 font-bold">{player.score} pts</span>
            </div>
            {player.eliminated && (
              <div className="text-red-400 text-xs">Éliminé</div>
            )}
            {/* Optionnel : afficher le rôle si disponible */}
            {/* {player.role && (
              <div className={`text-xs ${player.role === 'apostat' ? 'text-red-400' : 'text-green-400'}`}>
                {player.role === 'apostat' ? 'Apostat' : 'Fidèle'}
              </div>
            )} */}
          </div>
        </div>
      ))}
    </div>
  );
}