import { ConflictException } from "../../common/exceptions/index.js";
import {findByIdAndUpdate } from "../../common/repository/index.js"
import { createLoginCradential } from "../../common/security/token.security.js";
import { ACCESS_TOKEN_EXPIRES_IN } from "../../config.js";
import { UserModel } from "../../DB/model/index.js"

export const profile = async (user)=>{
    return user;
}
export const update = async (user , data)=>{
    const account = await findByIdAndUpdate({
        id : user._id,
        update : data,
        model : UserModel,
    })
    return account;
}
export const rotate_token = async (payload , user)=>{
    const accessTokenExpairIn = (payload.iat + ACCESS_TOKEN_EXPIRES_IN) * 1000;
    const currentTime = Date.now() + (30 * 60 * 1000);
    if(currentTime < accessTokenExpairIn){
        throw ConflictException({message : "Sorry we cannot create new login credantial while current access token still witg range time"})
    }
    return await createLoginCradential({user})
}