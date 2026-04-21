import type {Request, Response} from 'express';
import {supabase}  from'../config/supabase.js';
//async makes the systme to not freez untile the db responds
export const register= async (req:Request, res:Response)=>{
    //this makes the system to grab fullname,emale from requested json
    const{fullname,email,phone,password,idNumber,role,location}=req.body;
try{
    // 2. The Auth Sign Up
const {data,  error}=await supabase.auth.signUp({
email,
    password,
    //option is used to return metadata when user login  full name and role
    options:{
        data:{
            full_name:fullname,
            role:role,
            location:location
        }
    }
    });
if (error) throw error;
//if user account creation faild the system should throw error instade of crashing
const userId=data.user?.id;
if(role==='hairdresser'){
    await supabase.from('hairdresser').insert([
        //in plan normal is used by default user are normal but if the user is hairdresser we need to add plan to the database
        {id:userId,phone,tin_or_id:idNumber,plan:'normal'}

    ]);

}else{
    await supabase.from('customer').insert([
{id:userId,phone,identification: idNumber}
    ]);

}
res.status(200).json({
    message:"successfully registered!check your email",
    user:data.user
});

}catch(error:any){
    res.status(400).json({error:error.message})
}
     }

     
     