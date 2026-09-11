import {db} from '../prisma/db';
import { Router } from 'express';
import type {Response, Request} from 'express';

export const voteRouter = Router();
voteRouter.post('/', (req:Request, res:Response) =>{
    //casting vote
    
});