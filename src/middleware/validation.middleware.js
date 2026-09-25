import { BadReaquestException } from "../common/exceptions/index.js";

export const validation = (schema) => {
    return async (req, res, next) => {
        const validationResult = schema.safeParse(req.body);
        if (!validationResult.success){
            throw BadReaquestException({message:"Validation Error" , issues: validationResult.error.issues})
        }
        req.validate = validationResult.data
        next();
    }
}
        