import {Request, Response, RequestHandler, NextFunction} from 'express'

const TryCatch = (handler: RequestHandler): RequestHandler =>{
return async(req:Request, res: Response, next: NextFunction)=>{
 try {
await handler(req, res, next);
} catch (err:any){
    console.log(err)
res.status(500).json({error: err.message});
}
}
}
export default TryCatch