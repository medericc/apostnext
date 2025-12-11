'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useGameStore } from '../lib/store';
import { PlayerForm } from '../components/PlayerForm';
import { PlayerList } from '../components/PlayerList';

export default function GamePage() {
  const router = useRouter();
  const { players, assignRoles, hasShownRules, markRulesAsShown, phase } = useGameStore();
  const [showRules, setShowRules] = useState(!hasShownRules);

  const canStartGame = players.length >= 4;
  const hasExistingScores = players.some(p => p.score > 0); // <-- NOUVEAU
  const isGameInProgress = phase === 'playing' || hasExistingScores; // <-- NOUVEAU

  const handleStartGame = () => {
    assignRoles();
    markRulesAsShown();
    router.push('/play');
  };


  const showRulesDialog = () => {
    setShowRules(true);
  };

  return (
    <div className="min-h-screen py-8">
      {/* En-tête */}
      <div className="text-center mb-8">
        <h1 className="font-cinzel text-4xl md:text-5xl gold-text mb-4">
          Préparation
        </h1>
        <p className="text-creme-200 text-lg">
          {players.length} joueur{players.length > 1 ? 's' : ''} inscrit{players.length > 1 ? 's' : ''}
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
        {/* Formulaire d'ajout */}
        <div className="p-6 parchment-bg rounded-2xl gold-border">
          <h2 className="font-cinzel text-2xl gold-text mb-6 text-center">
            Ajouter des Joueurs
          </h2>
          <PlayerForm />
        </div>

        {/* Liste des joueurs */}
        <div className="p-6 parchment-bg rounded-2xl gold-border">
          <h2 className="font-cinzel text-2xl gold-text mb-6 text-center">
            Joueurs ({players.length}/8)
          </h2>
          <PlayerList />
          
          {/* Boutons d'action */}
          <div className="mt-8 text-center space-y-4">
            {canStartGame && !isGameInProgress && (
              <button
                onClick={handleStartGame}
                className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 text-white font-bold py-4 px-8 rounded-xl text-lg transition-all duration-300 transform hover:scale-105 shadow-lg w-full max-w-xs"
              >
                🎯 COMMENCER LA PARTIE
              </button>
            )}
            
            {isGameInProgress && (
              <>
                <button
                  onClick={handleStartGame}
                  className="bg-gradient-to-r from-yellow-600 to-yellow-700 hover:from-yellow-500 hover:to-yellow-600 text-slate-900 font-bold py-4 px-8 rounded-xl text-lg transition-all duration-300 transform hover:scale-105 shadow-lg w-full max-w-xs"
                >
                  🔄 CONTINUER LA PARTIE
                </button>
                {/* <button
                  onClick={() => {
                    // Réinitialiser pour nouvelle partie
                    useGameStore.getState().resetGame();
                    assignRoles();
                    router.push('/play');
                  }}
                  className="text-creme-200/70 hover:text-creme-200 text-sm underline transition-colors"
                >
                  Recommencer à zéro
                </button> */}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Bouton règles */}
      <div className="text-center mt-8">
        <button
          onClick={showRulesDialog}
          className="bg-slate-700/50 hover:bg-slate-600/50 text-creme-200 py-3 px-6 rounded-lg border border-yellow-600/30 transition-colors"
        >
          📖 Voir les Règles
        </button>
      </div>

      {/* Modal des règles */}
      {showRules && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-2xl gold-border max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="text-center mb-6">
              <h2 className="font-cinzel text-3xl gold-text mb-4">
                RÈGLES DU JEU
              </h2>
              <div className="w-20 h-1 bg-yellow-600 mx-auto"></div>
            </div>

            <div className="space-y-4 text-creme-200">
              <div className="p-4 bg-slate-700/30 rounded-lg">
                <h3 className="font-cinzel text-xl gold-text mb-2">🎯 Objectif</h3>
                <p>Les <strong>Fidèles</strong> doivent éliminer les <strong>Apostats</strong>.</p>
                <p>Les <strong>Apostats</strong> doivent se fondre dans la masse.</p>
              </div>

              <div className="p-4 bg-slate-700/30 rounded-lg">
                <h3 className="font-cinzel text-xl gold-text mb-2">🔄 Déroulement</h3>
                <ol className="list-decimal list-inside space-y-2">
                  <li>Chaque joueur reçoit un mot secret</li>
                  <li>Les Fidèles ont le même mot, les Apostats un mot différent</li>
                  <li>Tour de table : chacun donne un indice sur son mot</li>
                  <li>Vote pour éliminer un suspect</li>
                  <li>Révélation du rôle de l&apos;éliminé</li>
                </ol>
              </div>

              <div className="p-4 bg-slate-700/30 rounded-lg">
                <h3 className="font-cinzel text-xl gold-text mb-2">🏆 Victoire</h3>
                <ul className="list-disc list-inside space-y-1">
                  <li><strong>Fidèles gagnent</strong> : +1 point chacun</li>
                  <li><strong>Apostats gagnent</strong> : +2 points chacun</li>
                  <li><strong>Premier à 25 points</strong> : couronnement !</li>
                </ul>
              </div>
            </div>

            <div className="text-center mt-8">
              <button
                onClick={() => setShowRules(false)}
                className="bg-gradient-to-r from-yellow-600 to-yellow-700 hover:from-yellow-500 hover:to-yellow-600 text-slate-900 font-bold py-3 px-8 rounded-xl transition-all duration-300"
              >
                J&apos;ai compris !
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Message d'aide */}
      {!canStartGame && (
        <div className="text-center mt-8 p-4 bg-yellow-600/20 rounded-lg max-w-md mx-auto">
          <p className="text-yellow-200">
            ⚠️ Minimum 4 joueurs requis pour commencer
          </p>
        </div>
      )}
    </div>
  );
}