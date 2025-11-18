'use client';

import { useState } from 'react';
import { useGameStore } from '../lib/store';

export function PlayerForm() {
  const [playerName, setPlayerName] = useState('');
  const { players, setPlayers } = useGameStore();

  const addPlayer = () => {
    if (playerName.trim() && players.length < 8) {
      const newPlayer = {
        id: Date.now().toString(),
        name: playerName.trim(),
        role: null,
        eliminated: false,
        score: 0
      };
      setPlayers([...players, newPlayer]);
      setPlayerName('');
    }
  };

  const removePlayer = (id: string) => {
    setPlayers(players.filter(p => p.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addPlayer();
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            placeholder="Nom du joueur..."
            className="flex-1 px-4 py-3 bg-slate-700/50 border border-yellow-600/30 rounded-lg text-creme-200 placeholder-creme-200/50 focus:outline-none focus:border-yellow-500"
            maxLength={20}
          />
          <button
            type="submit"
            disabled={!playerName.trim() || players.length >= 8}
            className="px-6 py-3 bg-yellow-600 hover:bg-yellow-500 disabled:bg-slate-600 disabled:cursor-not-allowed text-slate-900 font-semibold rounded-lg transition-colors"
          >
            Ajouter
          </button>
        </div>
      </form>

      <div className="text-sm text-creme-200/70 text-center">
        {players.length}/8 joueurs maximum
      </div>

      {/* Liste rapide avec suppression */}
      {players.length > 0 && (
        <div className="space-y-2 max-h-40 overflow-y-auto">
          {players.map((player) => (
            <div
              key={player.id}
              className="flex justify-between items-center p-3 bg-slate-700/30 rounded-lg"
            >
              <span className="text-creme-200">{player.name}</span>
              <button
                onClick={() => removePlayer(player.id)}
                className="text-red-400 hover:text-red-300 text-lg"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}