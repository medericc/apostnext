export interface Player {
  id: string;
  name: string;
  role: 'fidele' | 'apostat' | null;
  eliminated: boolean;
  score: number;
}

export interface GameState {
  players: Player[];
  currentRound: number;
  usedPairs: string[][];
  currentPair: { fidele: string; apostat: string } | null;
  votes: Record<string, number>;
  phase: 'setup' | 'playing' | 'voting' | 'results' | 'gameEnd';
  hasShownRules: boolean;
}

export interface GameActions {
  setPlayers: (players: Player[]) => void;
  assignRoles: () => void;
  addVote: (playerId: string) => void;
  eliminatePlayer: (playerId: string) => void;
  nextRound: () => void;
  resetGame: () => void;
  setPhase: (phase: GameState['phase']) => void;
  markRulesAsShown: () => void;
}

export type GameStore = GameState & GameActions;