import { LanguageEnum } from "../common/enum/index.js";
import { BadReaquestException } from "../common/exceptions/index.js";

export const validation = (schema) => {
    return async (req, res, next) => {
        const lang = Number(req.headers["accept-language"] ?? LanguageEnum.EN);
        const validationResult = schema(lang).safeParse({
            body: req.body,
            query: req.query,
            params: req.params
        });
        if (!validationResult.success){
            throw BadReaquestException({message:"Validation Error" , issues: validationResult.error.issues})
        }
        req.validate = validationResult.data
        next();
    }
}
        