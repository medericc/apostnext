'use client';

import { Player } from '../type/game';

interface ScoreBoardProps {
  players: Player[];
  showCrown?: boolean;
  compact?: boolean;
}

export function ScoreBoard({ players, showCrown = false, compact = false }: ScoreBoardProps) {
  const sortedPlayers = [...players].sort((a, b) => b.score - a.score);
  const winner = sortedPlayers[0];
  const hasWinner = showCrown && winner.score >= 25;

  if (compact) {
    return (
      <div className="space-y-2">
        {sortedPlayers.map((player, index) => (
          <div
            key={player.id}
            className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg border border-slate-600"
          >
            <div className="flex items-center space-x-3">
              <div className={`
                w-8 h-8 flex items-center justify-center rounded-full font-semibold
                ${index === 0 ? 'bg-yellow-400 text-slate-900' : 'bg-slate-600 text-creme-200'}
              `}>
                {index + 1}
              </div>
              <span className="text-creme-200 font-medium">{player.name}</span>
              {hasWinner && player.id === winner.id && (
                <span className="text-yellow-400">👑</span>
              )}
            </div>
            <div className="text-right">
              <span className="text-yellow-400 font-bold">{player.score} pts</span>
              {player.eliminated && (
                <div className="text-red-400 text-xs">Éliminé</div>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* En-tête */}
      <div className="text-center mb-6">
        <h2 className="font-cinzel text-3xl gold-text mb-2">
          {hasWinner ? 'COURONNEMENT' : 'ARCHIVES DU ROUND'}
        </h2>
        {hasWinner && (
          <p className="text-creme-200 text-lg">
            👑 {winner.name} règne en maître !
          </p>
        )}
      </div>

      {/* Tableau des scores */}
      <div className="space-y-3">
        {sortedPlayers.map((player, index) => (
          <div
            key={player.id}
            className={`
              p-4 rounded-xl border-2 transition-all duration-300
              ${index === 0 && hasWinner
                ? 'bg-yellow-600/20 border-yellow-400 scale-105'
                : 'bg-slate-700/30 border-slate-600'
              }
            `}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                {/* Position */}
                <div className={`
                  w-12 h-12 flex items-center justify-center rounded-full font-bold text-lg
                  ${index === 0 ? 'bg-yellow-400 text-slate-900' : 
                    index === 1 ? 'bg-slate-500 text-creme-200' : 
                    index === 2 ? 'bg-amber-700 text-creme-200' : 
                    'bg-slate-700 text-creme-200'}
                `}>
                  {index + 1}
                </div>

                {/* Nom et rôle */}
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-creme-200 font-semibold text-lg">
                      {player.name}
                    </span>
                    {hasWinner && player.id === winner.id && (
                      <span className="text-2xl">👑</span>
                    )}
                  </div>
                  <div className="flex space-x-2 text-sm">
                    <span className={`
  ${(player.role || player.previousRole) === 'apostat' ? 'text-red-400' : 'text-green-400'}
`}>
  {(player.role || player.previousRole) === 'apostat' ? 'Apostat' : 'Fidèle'}
</span>
                    {player.eliminated && (
                      <span className="text-red-400">⚰️ Éliminé</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Score */}
              <div className="text-right">
                <div className={`
                  text-2xl font-bold
                  ${index === 0 ? 'text-yellow-400' : 'text-creme-200'}
                `}>
                  {player.score} pts
                </div>
                {player.score >= 25 && (
                  <div className="text-yellow-400 text-sm font-semibold">
                    VICTOIRE !
                  </div>
                )}
              </div>
            </div>

            {/* Barre de progression */}
            <div className="mt-3">
              <div className="w-full bg-slate-600 rounded-full h-2">
                <div
                  className="bg-yellow-400 h-2 rounded-full transition-all duration-1000"
                  style={{ width: `${Math.min(100, (player.score / 25) * 100)}%` }}
                />
              </div>
              <div className="text-xs text-creme-200/60 mt-1 text-right">
                {player.score}/25 points
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}