import {Router} from 'express';
import {db} from '../prisma/db';
import type{Response, Request} from 'express';

export const playerRouter = Router();
playerRouter.post('/', async(req: Request, res:Response) => {

    res.status(200).json({message: "ok"});
});