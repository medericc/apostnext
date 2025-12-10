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
  
  // 1. Marquer le joueur comme éliminé
  const updatedPlayers = state.players.map((p) =>
    p.id === playerId ? { ...p, eliminated: true } : p
  );

  // 2. Vérifier fin de MANCHE
  const aliveApostats = updatedPlayers.filter(p => p.role === 'apostat' && !p.eliminated);
  const aliveFideles = updatedPlayers.filter(p => p.role === 'fidele' && !p.eliminated);

  // FIN DE MANCHE ?
  const mancheTerminee = aliveApostats.length === 0 || aliveFideles.length === 0;
  
  if (mancheTerminee) {
    // Décider qui gagne la manche
    const winnerCamp = aliveApostats.length === 0 ? 'fidele' : 'apostat';
    
    console.log(`Fin de manche ! ${winnerCamp} gagnent`);
    
    // Attribution des points
    const playersAvecPoints = updatedPlayers.map((p) => ({
      ...p,
      score: p.score + (p.role === winnerCamp ? 
        (winnerCamp === 'apostat' ? 2 : 1) : 0),
    }));

    // Vérifier si quelqu'un a 25 points (FIN DE PARTIE)
    const champion = playersAvecPoints.find(p => p.score >= 25);
    
    if (champion) {
      console.log(`${champion.name} a gagné la partie avec ${champion.score} points!`);
      set({
        players: playersAvecPoints,
        phase: 'gameEnd',
        votes: {},
      });
      return;
    }

    // Sinon, nouvelle manche
    console.log('Préparation nouvelle manche...');
    set({
      players: playersAvecPoints.map(p => ({
        ...p,
        eliminated: false,
        role: null, // Rôles seront réassignés
      })),
      currentPair: null,
      votes: {},
      phase: 'setup', // Retour au setup pour nouvelle manche
    });
    return;
  }

  // SINON : CONTINUER LA MANCHE ACTUELLE
  console.log(`Manche continue. Apostats restants: ${aliveApostats.length}, Fidèles restants: ${aliveFideles.length}`);
  
  set({
    players: updatedPlayers,
    votes: {}, // Réinitialiser votes pour prochain tour
    // phase reste 'playing' pour continuer à voter
  });
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