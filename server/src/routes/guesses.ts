import{db} from '../prisma/db'
import { Router } from 'express';
import type { Request, Response } from 'express';
import {z} from 'zod';

export const CreateGuessBody = z.object({
    token: z.string(),
    itemAId: z.string(),
    itemBId: z.string(),
    statTypeId: z.string(),
    mode: z.enum(['higher', 'lower']),
    userAnswer: z.string(),

});
export const guessesRouter = Router();

//Inside the 'if (kind === 'guess)' branch in topics.ts
guessesRouter.post('/',(req: Request, res:Response) => {

    //scoring core
    //Body: token, itemAId, itemBId, stateTypeId, mode, userAnswer

    //Search: statevalue rows (where(itemId, stateTypeId). first()) ; returns string value "5.99"

    //compute correct answer 

    //return isCorrect

});

/*
* Zod is a runtime schema validation library. 
* req.body is a typed `any` in Express - Typescript will let a route handler read req.body.token even if the actual request had no token at all, because `any` disables type checking entirely.
* Zod lets you describe the SHAPE a value must have, then actually check the real data gainst it at runtime. 
* Zod is better than using a bunch of `if` checks. 
*/
