import{db} from '../prisma/db'
import { Router } from 'express';
import type { Request, Response } from 'express';

export const guessesRouter = Router();
guessesRouter.post('/',(req: Request, res:Response) => {
    //scoring core
    //Body: token, itemAId, itemBId, stateTypeId, mode, userAnswer

    //Search: statevalue rows (where(itemId, stateTypeId). first()) ; returns string value "5.99"

    //compute correct answer 

    //return isCorrect

});