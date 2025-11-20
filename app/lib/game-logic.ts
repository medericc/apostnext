import { Player } from '../type/game';
import { WORD_PAIRS } from './pairs';

export function assignRoles(players: Player[], pair: { fidele: string; apostat: string }): Player[] {
 const shuffled = players; // ils sont déjà mélangés dans le store
 const undercoverCount = players.length >= 6 ? 2 : 1;

  return shuffled.map((player, index) => ({
    ...player,
    role: index < undercoverCount ? 'apostat' : 'fidele'
  }));
}

export function getRandomWordPair(usedPairs: string[][]) {
  const available = WORD_PAIRS.filter(pair => 
    !usedPairs.some(used => used[0] === pair.fidele && used[1] === pair.apostat)
  );

  if (available.length === 0) return null;
  return available[Math.floor(Math.random() * available.length)];
}

export function checkGameEnd(players: Player[]) {
  const activePlayers = players.filter(p => !p.eliminated);
  const apostats = activePlayers.filter(p => p.role === 'apostat');
  const fideles = activePlayers.filter(p => p.role === 'fidele');

  // Apostats éliminés → Fidèles gagnent
  if (apostats.length === 0) {
    return { 
      gameEnded: true, 
      winners: fideles.map(p => p.id),
      reason: 'fideles_win'
    };
  }

  // Plus assez de joueurs ou tous les fidèles éliminés → Apostats gagnent
  if (activePlayers.length <= 2 || fideles.length === 0) {
    return { 
      gameEnded: true, 
      winners: apostats.map(p => p.id),
      reason: 'apostats_win'
    };
  }

  return { gameEnded: false, winners: [], reason: '' };
}