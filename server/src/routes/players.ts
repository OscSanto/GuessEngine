import {Router} from 'express';
import type{Response, Request} from 'express';
import {z} from 'zod';
import { findOrCreatePlayer } from '../lib/players';

export const CreatePlayerBody = z.object({
    // Client-generated/cached token. Omit it to mint a brand new player.
    token: z.string().min(1).optional(),
});


export const playerRouter = Router();

// Find-or-create: 
//      same token in -> same player back. 
//      No token -> new player + fresh token.
playerRouter.post('/', async(req: Request, res:Response) => {
    const parsed = CreatePlayerBody.safeParse(req.body); //no exception throwing on validation failure
    if (!parsed.success) {
        res.status(400).json({ error: z.flattenError(parsed.error) });
        return;
    }

    const { player, created } = await findOrCreatePlayer(parsed.data.token);

    res.status(created ? 201 : 200).json({ player: { id: player.id, token: player.token } });
});