import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { GameStore } from '../type/game';
import { assignRoles, getRandomWordPair, checkGameEnd } from './gameLogic';

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
      setPlayers: (players) => set({ players }),

      assignRoles: () => {
        const state = get();
        const pair = getRandomWordPair(state.usedPairs);
        
        if (!pair) {
          console.error('Plus de paires disponibles');
          return;
        }

        const playersWithRoles = assignRoles(state.players, pair);
        
        set({
          players: playersWithRoles,
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