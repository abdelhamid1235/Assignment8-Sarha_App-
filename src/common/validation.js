import {z} from "zod";
import { GenderEnum, LanguageEnum } from "./enum/index.js";
import { ValidationLangMessages } from "./exceptions/index.js";

const getValidationlangMessage = (lang , code)=>{
    return lang === LanguageEnum.AR ? ValidationLangMessages[code].ar : ValidationLangMessages[code].en;
}

const matchFields = ({origin , copy , data , ctx , lang})=>{
    if(data[origin] != data[copy]){
        ctx.addIssue({
            code : "custom",
            path:[copy],
            message:lang === LanguageEnum.AR ?`فشل في التوافق بين ال ${origin} و ${copy}` : `Faild Match Between ${origin} And ${copy}`
        })
    }
}

export const generaValidationFields = {
    email:(lang) => z.email({ error: getValidationlangMessage(lang, 102) }),
    
    password:(lang) => z.string()
        .min(8, { error: getValidationlangMessage(lang, 103) })
        .max(20, { error: getValidationlangMessage(lang, 104) })
        .regex( /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!$%^&*~#]).{8,20}$/, { error: getValidationlangMessage(lang, 107) } ),
    
    userName: (lang) => z.string()
        .min(5, { error: getValidationlangMessage(lang, 100) })
        .max(50, { error: getValidationlangMessage(lang, 101) })
        .regex( /^[A-Z]{1}[a-z]{1,24}\s[A-Z]{1}[a-z]{1,24}$/, { error: getValidationlangMessage(lang, 108) } ), 
    
    confirmPassword: (lang) => z.string()
        .min(8, { error: getValidationlangMessage(lang, 103) })
        .max(20, { error: getValidationlangMessage(lang, 104) }), 
    
    phone: (lang) => z.string().regex( /^(\+2)?01[0-25]\d{8}$/,{ error: getValidationlangMessage(lang, 105) } ), 

    gender: (lang) => z.enum(GenderEnum, { error: getValidationlangMessage(lang, 106) }), 

    matchFields
}