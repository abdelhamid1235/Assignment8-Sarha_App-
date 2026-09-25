import {z} from "zod";

export const login = z.strictObject({
    email : z.email(),
    password : z.string().min(8).max(20)
})

export const signup = login.safeExtend({
    userName:z.string(),
    confirmPassword: z.string().min(8).max(20),
    phone : z.e164(),
}).superRefine((data , ctx)=>{
    if(data.password != data.confirmPassword){
        ctx.addIssue({
            code : "custom",
            path:['confirmPassword'],
            message:"password mismatch witch confirmPassword"
        })
    }

    if(!data.userName.includes(" ")){
        ctx.addIssue({
            code : "custom",
            path:['userName'],
            message:"userName must contain FirstName And LastName"
        })
    }
})