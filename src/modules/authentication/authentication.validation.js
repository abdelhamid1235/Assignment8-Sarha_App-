import {z} from "zod";
import { generaValidationFields } from "../../common/validation.js";

export const loginSchema = (lang)=>{
    return z.strictObject({
    email : generaValidationFields.email(lang),
    password : generaValidationFields.password(lang)
})
}
export const login = (lang)=>{
    return z.object({
        body:loginSchema(lang)
    })
}

export const signup = (lang)=>{
    return z.object({
    body:loginSchema(lang).safeExtend({
        userName:generaValidationFields.userName(lang),
        confirmPassword: generaValidationFields.password(lang),
        phone : generaValidationFields.phone(lang),
        gender: generaValidationFields.gender(lang)

    }).superRefine((data , ctx)=>{
        generaValidationFields.matchFields({origin:"password" , copy:"confirmPassword",data , ctx , lang})
    })
})
}