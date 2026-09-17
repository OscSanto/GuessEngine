// Shared player identity lookup 
// --- 
// used by the /players route directly, and by /guesses and /votes so a request can resolve its player 
import { db } from '../prisma/db';
import { randomUUID } from 'node:crypto';

export async function findOrCreatePlayer(token?: string) {
    const resolvedToken = token ?? randomUUID();

    const existing = await db.orm.public.Player.where({ token:resolvedToken }).first();
    if (existing) return { player: existing, created: false as const };

    // createdAt is left unset 
    // the contract defaults it to now() at insert time.
    const player = await db.orm.public.Player.create({ id:randomUUID(), token: resolvedToken });
    return { player, created: true as const };
}
