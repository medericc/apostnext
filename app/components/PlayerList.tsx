'use client';

import { useGameStore } from '../lib/store';

export function PlayerList() {
  const { players } = useGameStore();

  if (players.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-creme-200/60">Aucun joueur ajouté</p>
        <p className="text-sm text-creme-200/40 mt-2">
          Ajoutez des joueurs pour commencer
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {players.map((player, index) => (
        <div
          key={player.id}
          className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg border border-yellow-600/20 hover:border-yellow-600/40 transition-colors"
        >
          <div className="flex items-center space-x-4">
            <div className="w-8 h-8 flex items-center justify-center bg-yellow-600/20 rounded-full">
              <span className="text-yellow-400 font-semibold">{index + 1}</span>
            </div>
            <span className="text-creme-200 font-medium">{player.name}</span>
          </div>
          
          <div className="text-right">
            <div className="text-creme-200/70 text-sm">
              Score: <span className="text-yellow-400">{player.score}</span>
            </div>
            {player.eliminated && (
              <div className="text-red-400 text-xs">Éliminé</div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}