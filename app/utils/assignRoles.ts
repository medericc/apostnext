// 1. Define the base structure of a Player object.
interface Player {
  id: number; // Example property
  name: string; // Example property
  // Add any other properties your player objects have
}

// 2. Define the structure of a Player object AFTER the role is assigned.
interface PlayerWithRole extends Player {
  role: "apostat" | "fidele";
}

/**
 * Assigns 'apostat' or 'fidele' roles to players using the Fisher-Yates shuffle.
 * @param players An array of Player objects.
 * @returns An array of PlayerWithRole objects.
 */
export function assignRolesToPlayers(players: Player[]): PlayerWithRole[] {
  // Mélange Fisher-Yates (vrai random)
  const shuffled = [...players];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  const undercoverCount = players.length >= 6 ? 2 : 1;

  return shuffled.map((p, i) => ({
    ...p,
    role: i < undercoverCount ? "apostat" : "fidele",
  }));
}