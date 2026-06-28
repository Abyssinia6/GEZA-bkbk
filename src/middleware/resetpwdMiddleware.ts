import { Request,Response,NextFunction} from 'express';
export  const resetchecker=(req:Request, res:Response, next:NextFunction)=>{
    if(!req.user){
        console.log("please signup first redirecting....");
    return res.redirect('/signup');
}
next();
};