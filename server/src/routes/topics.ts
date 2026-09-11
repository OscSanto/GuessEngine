import type { Request, Response } from 'express';
import {Router} from 'express'; //Generally, don't pass 'Application'; use Router.
//import type { Application } from 'express';
import {db} from '../prisma/db';

//With Router pattern, index.ts is a small mounting table 
// one (app.use('/prefix', xxxRouter)) line per feature area. and the Individual endpoints lieve inside each router file (like here)
//in index.ts : 'app.use('/topics', topicRouter) mounts the router at /topics. 
export const topicRouter = Router();
topicRouter.get('/', async(_req: Request, res: Response) =>{
    const topics = await db.orm.public.Topic.select('id', 'slug', 'name','description','isActive').all();
    res.status(200).json({topics});
});

topicRouter.get('/:slug', async (req: Request, res:Response) => {
    //filter + string-param guard
    const slug = req.params['slug'];
    if(typeof slug !== 'string') {res.status(400).json({error: 'missing slug'}); return;}

    const topic = await db.orm.public.Topic.where({slug}).include('statTypes').include('voteDimensions').first();
    if(!topic) {res.status(404).json({error:'topic not found'}); return;}

    res.status(200).json(topic);
})
