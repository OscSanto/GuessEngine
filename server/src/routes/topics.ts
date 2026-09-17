import type { Request, Response } from 'express';
import {Router} from 'express'; //Generally, don't pass 'Application'; use Router.
//import type { Application } from 'express';
import {db} from '../prisma/db';

/*
1. GET /topics -> list of topic (id, slug, name, desc, isActive) 
2. client shows a picker
3. GET /topics/:slug  -> one topic + its stateTypes + voteDimensions 
4. 
*/


//With Router pattern, index.ts is a small mounting table 
// one (app.use('/prefix', xxxRouter)) line per feature area. and the Individual endpoints lieve inside each router file (like here)
//in index.ts : 'app.use('/topics', topicRouter) mounts the router at /topics. 
export const topicRouter = Router();
topicRouter.get('/', async(_req: Request, res: Response) =>{
    const topics = await db.orm.public.Topic.select('id', 'slug', 'name','description','isActive').all();
    res.status(200).json({topics});
});

//:slug is a parameter placeholder. 
//'/topics/fastfood -> req.params.slug === 'fastfood'
//'/topics' -> does not match /:slug
//'/topics/a/b -> two segments
topicRouter.get('/:slug', async (req: Request, res:Response) => {
    //filter + string-param guard
    const slug = req.params['slug'];

    if(typeof slug !== 'string') {res.status(400).json({error: 'missing slug'}); return;}

    const topic = await db.orm.public.Topic
    .where({slug})
    .include('statTypes')
    // Vote mechanic disabled for now — MVP is guessing-only. See src/routes/votes.ts.
    // .include('voteDimensions')
    .first();
    if(!topic) {res.status(404).json({error:'topic not found'}); return;}

    res.status(200).json({topic});
})

// The old stateless "one random round" endpoint (2 random items, kind: guess|vote)
// is superseded by the higher/lower run mechanic in src/routes/runs.ts — a run
// carries a streak across rounds, which a stateless per-call endpoint can't.
// Left here commented out rather than deleted in case the old shape is wanted
// again later.
//
// topicRouter.get('/:slug/round', async (req: Request, res: Response) => {
//     const slug = req.params['slug'];
//     if (typeof slug !== 'string') { res.status(400).json({ error: 'missing slug' }); return; }
//
//     const topic = await db.orm.public.Topic
//         .where({ slug })
//         .include('items')
//         .include('statTypes')
//         .include('voteDimensions')
//         .first();
//     if (!topic) { res.status(404).json({ error: 'topic not found' }); return; }
//
//     const hasEnoughItems : boolean = topic.items.length >= 2;
//     let randGuessArr = topic.statTypes.filter(s => s.isGuessable);
//     const canGuess : boolean = hasEnoughItems && (randGuessArr.length > 0);
//     const canVote : boolean = hasEnoughItems && topic.voteDimensions.length > 0;
//
//     if (!canGuess && !canVote){
//         res.status(422).json( {message: "Unprocessable Content."});
//         return;
//     };
//
//     const possibleKinds: ('guess' | 'vote')[] = [];
//     if (canGuess) possibleKinds.push('guess');
//     if (canVote) possibleKinds.push('vote');
//     const kind = pick(possibleKinds);
//
//     const [itemA, itemB] = shuffle(topic.items);
//     const items = [
//         { id: itemA!.id, name: itemA!.name },
//         { id: itemB!.id, name: itemB!.name },
//     ];
//     const mode = pick(['higher', 'lower'] as const);
//     if (kind === 'guess') {
//         const stat = pick(randGuessArr);
//         res.status(200).json({
//             kind: 'guess',
//             topicSlug: topic.slug,
//             stat: { id: stat.id, key: stat.key, label: stat.label },
//             mode,
//             items,
//         });
//         return;
//     }
//
//     const dimension = pick(topic.voteDimensions);
//     res.status(200).json({
//         kind: 'vote',
//         topicSlug: topic.slug,
//         dimension: { id: dimension.id, key: dimension.key, label: dimension.label },
//         items,
//     });
// });