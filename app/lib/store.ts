import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { GameStore } from '../type/game';
import { assignRoles, getRandomWordPair, checkGameEnd } from './game-logic';

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      // État initial
      players: [],
      currentRound: 1,
      usedPairs: [],
      currentPair: null,
      votes: {},
      phase: 'setup',
      hasShownRules: false,

      // Actions
      setPlayers: (players) => {
  const shuffled = [...players];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  set({ players: shuffled });
},

// Dans votre fichier store (useGameStore)

      assignRoles: () => {
        const state = get();
        const pair = getRandomWordPair(state.usedPairs);

        if (!pair) {
          console.error('Plus de paires disponibles');
          return;
        }

        // 1. Copier et mélanger les joueurs (ce que vous faites déjà)
        const shuffledPlayers = [...state.players];
        for (let i = shuffledPlayers.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [shuffledPlayers[i], shuffledPlayers[j]] = [shuffledPlayers[j], shuffledPlayers[i]];
        }
        
        // 2. Assigner les rôles sur le tableau mélangé
        const playersWithRoles = assignRoles(shuffledPlayers, pair);

        // 3. 🔥 LA CORRECTION : Re-mélanger la liste APRÈS l'assignation !
        //    Sinon, players[0] est toujours l'apostat sur l'écran de jeu.
        for (let i = playersWithRoles.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [playersWithRoles[i], playersWithRoles[j]] = [playersWithRoles[j], playersWithRoles[i]];
        }

        set({
          players: playersWithRoles, // C'est déjà une nouvelle copie, pas besoin de [... ]
          currentPair: pair,
          usedPairs: [...state.usedPairs, [pair.fidele, pair.apostat]],
          votes: {},
          phase: 'playing'
        });
      },


      addVote: (playerId) => {
        const state = get();
        const newVotes = { ...state.votes };
        newVotes[playerId] = (newVotes[playerId] || 0) + 1;
        
        set({ votes: newVotes });
      },

      eliminatePlayer: (playerId) => {
        const state = get();
        const updatedPlayers = state.players.map(p =>
          p.id === playerId ? { ...p, eliminated: true } : p
        );

        const gameResult = checkGameEnd(updatedPlayers);
        
        if (gameResult.gameEnded) {
          const scoredPlayers = updatedPlayers.map(p => ({
            ...p,
            score: p.score + (gameResult.winners.includes(p.id) 
              ? (p.role === 'apostat' ? 2 : 1) 
              : 0)
          }));

          set({ 
            players: scoredPlayers, 
            phase: 'results',
            votes: {}
          });
        } else {
          set({ players: updatedPlayers });
        }
      },

      nextRound: () => {
        const state = get();
        const resetPlayers = state.players.map(p => ({
          ...p,
          eliminated: false,
          role: null
        }));

        set({
          players: resetPlayers,
          currentRound: state.currentRound + 1,
          currentPair: null,
          votes: {},
          phase: 'setup'
        });
      },

      resetGame: () => {
        set({
          players: [],
          currentRound: 1,
          usedPairs: [],
          currentPair: null,
          votes: {},
          phase: 'setup',
          hasShownRules: false
        });
      },

      setPhase: (phase) => set({ phase }),
      markRulesAsShown: () => set({ hasShownRules: true })
    }),
    {
      name: 'apostat-game-storage',
      version: 1
    }
  )
);