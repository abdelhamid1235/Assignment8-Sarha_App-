import { TokenTypeEnum } from "../common/enum/index.js";
import { ForbiddenException, UnauthorizedException } from "../common/exceptions/index.js";
import { basicAuth, decodeToken } from "../common/security/index.js";


export const authentication = (tokenType = TokenTypeEnum.ACCESS )=>{
    return async (req , res  , next)=>{
    const {authorization} = req.headers;
    if(!authorization) throw UnauthorizedException({message:"Unauthorized Account"});
    const [key , credential] = authorization.split(" ")|| [];
    switch (key) {
        case "Basic":
            const [email, password] = Buffer.from(credential , "base64").toString().split(":");
            console.log({email, password});
            req.user = await basicAuth({email, password});
            break;
        case "Bearer":
            const {user , payload} = await decodeToken({authorization:credential , tokenType});
            req.user = user;
            req.payload = payload;
            break;
        default:
            next(new Error("Invalid Authorization Key" , {cause : {status : 400}}));
    }
    next();
}
}


export const authorization = (accessRoles)=>{
    return async (req , res  , next)=>{
        if(req.user.role < accessRoles){
            throw ForbiddenException({message:"Forbidden Account"});
        }
        next();
    }
}