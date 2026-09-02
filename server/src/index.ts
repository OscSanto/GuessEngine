import express from 'express'; 
import type { Request, Response, Application } from 'express';


const app = express();
const port: number = 4000;

app.use(express.json());


app.get('/', (request: Request, response: Response) => { 
    console.log("getRequest");
    response.status(200).json({
        message: "hello world! Typescript with express is working!"
    })
});//how do we get/check/handle the request package? 


//are we just listening? not doing anything else?
//is this like "/health"? where we check to see if the server is avaiable?
app.listen(port, () => {
    console.log(`You have reached port ${port}.` );
}); 



