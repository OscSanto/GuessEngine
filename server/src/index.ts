import 'dotenv/config';
import express from 'express'; 
import type { Request, Response, Application } from 'express';
import {db} from './prisma/db';
import { topicRouter } from './routes/topics';
import { guessesRouter } from './routes/guesses';
import { playerRouter } from './routes/players';
import { voteRouter } from './routes/votes';

//Split routes out of index.ts

const app = express();
const port = Number(process.env['PORT']) || 4000;
app.use(express.json()); 
app.get('/health', (_req: Request, res: Response)=>{ res.status(200).json({status: 'ok!'}); });

//app.get(path,handler)
app.use('/topics', topicRouter);
app.use('/guesses', guessesRouter);
app.use('/votes', voteRouter);
app.use('/players', playerRouter);






//app.lsten() goes last. Always
//are we just listening? not doing anything else?
//is this like "/health"? where we check to see if the server is avaiable?
app.listen(port, () => {
    console.log(`You have reached port ${port}.` );
}); 



