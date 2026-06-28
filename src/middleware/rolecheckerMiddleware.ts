import {Request, Response,NextFunction} from 'express';
export const rolecheck=(req:Request, res:Response, next:NextFunction)=>{
    if(!req.user){
        console.log("signup first");
        return res.redirect("/signup")
    }
    if(req.user.role!=='admin' && req.user.role!=='hairdresser'){
console.log("access denied");
        return res.status(403).json({error:"pls select correct role"})

    }
    next();
};