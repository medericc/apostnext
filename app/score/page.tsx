'use client';

import { useRouter } from 'next/navigation';
import { useGameStore } from '../lib/store';
import { ScoreBoard } from '../components/ScoreBoard';

export default function ResultsPage() {
  const router = useRouter();
  const { players, nextRound, resetGame, currentRound } = useGameStore();

  const sortedPlayers = [...players].sort((a, b) => b.score - a.score);
  const winner = sortedPlayers[0];
  const hasWinner = winner.score >= 25;
  const activePlayers = players.filter(p => !p.eliminated);

  const handleNewRound = () => {
    nextRound();
    router.push('/game');
  };

  const handleNewGame = () => {
    resetGame();
    router.push('/');
  };

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-4xl mx-auto">
        {/* En-tête */}
        <div className="text-center mb-8">
          <h1 className="font-cinzel text-5xl gold-text mb-4">
            {hasWinner ? 'COURONNEMENT' : 'RÉSULTATS'}
          </h1>
          <p className="text-creme-200 text-lg">
            Round {currentRound} • {activePlayers.length} joueur{activePlayers.length > 1 ? 's' : ''} actif{activePlayers.length > 1 ? 's' : ''}
          </p>
        </div>

        {/* Tableau des scores */}
        <div className="mb-8">
          <ScoreBoard players={players} showCrown={true} />
        </div>

        {/* Statistiques du round */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="p-4 bg-slate-700/30 rounded-lg text-center">
            <div className="text-2xl gold-text font-bold">{currentRound}</div>
            <div className="text-creme-200/70 text-sm">Round</div>
          </div>
          <div className="p-4 bg-slate-700/30 rounded-lg text-center">
            <div className="text-2xl text-green-400 font-bold">
              {players.filter(p => p.role === 'fidele' && !p.eliminated).length}
            </div>
            <div className="text-creme-200/70 text-sm">Fidèles restants</div>
          </div>
          <div className="p-4 bg-slate-700/30 rounded-lg text-center">
            <div className="text-2xl text-red-400 font-bold">
              {players.filter(p => p.role === 'apostat' && !p.eliminated).length}
            </div>
            <div className="text-creme-200/70 text-sm">Apostats restants</div>
          </div>
        </div>

        {/* Actions */}
        <div className="text-center space-y-4">
          {!hasWinner ? (
            <>
              <button
                onClick={handleNewRound}
                className="block w-full max-w-md mx-auto bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 text-white font-bold py-4 px-8 rounded-xl text-lg transition-all duration-300 transform hover:scale-105"
              >
                🎯 TOUR SUIVANT
              </button>
              <button
                onClick={handleNewGame}
                className="text-creme-200/70 hover:text-creme-200 underline transition-colors"
              >
                Nouvelle partie
              </button>
            </>
          ) : (
            <>
              <div className="p-6 bg-yellow-600/20 rounded-2xl gold-border mb-6">
                <h3 className="font-cinzel text-2xl gold-text mb-2">
                  👑 Victoire de {winner.name} !
                </h3>
                <p className="text-creme-200">
                  Félicitations pour cette magnifique performance !
                </p>
              </div>
              <button
                onClick={handleNewGame}
                className="block w-full max-w-md mx-auto bg-gradient-to-r from-yellow-600 to-yellow-700 hover:from-yellow-500 hover:to-yellow-600 text-slate-900 font-bold py-4 px-8 rounded-xl text-lg transition-all duration-300 transform hover:scale-105"
              >
                🎮 NOUVELLE PARTIE
              </button>
            </>
          )}
        </div>

        {/* Message de fin */}
        {hasWinner && (
          <div className="text-center mt-8 p-4 bg-slate-800/30 rounded-lg">
            <p className="text-creme-200/60 text-sm">
              Merci d&apos;avoir joué à L&apos;Apostat !
            </p>
          </div>
        )}
      </div>
    </div>
  );
}