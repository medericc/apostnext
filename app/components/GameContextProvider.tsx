'use client';

import { useEffect } from 'react';
import { useGameStore } from '../lib/store';

export function GameProvider({ children }: { children: React.ReactNode }) {
  const { players, phase, setPhase } = useGameStore();

  // Gestion automatique des phases
  useEffect(() => {
    if (players.length >= 4 && phase === 'setup') {
      setPhase('playing');
    }
  }, [players.length, phase, setPhase]);

  return <>{children}</>;
}