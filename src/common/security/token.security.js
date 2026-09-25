import jwt from "jsonwebtoken"
import { ACCESS_ADMIN_TOKEN_SIGNATURE, ACCESS_TOKEN_EXPIRES_IN, ACCESS_USER_TOKEN_SIGNATURE, REFRESH_ADMIN_TOKEN_SIGNATURE, REFRESH_TOKEN_EXPIRES_IN, REFRESH_USER_TOKEN_SIGNATURE } from "../../config.js"
import { BadReaquestException, NotFoundException } from "../exceptions/index.js"
import { findById, findOne } from "../repository/index.js"
import { UserModel } from "../../DB/model/index.js"
import { RoleEnum, TokenTypeEnum } from "../enum/index.js"
import { compare } from "./hash.security.js"


export const createToken = async ({
    payload = {},
    options = {},
    secret = ACCESS_USER_TOKEN_SIGNATURE
} = {})=>{
    return jwt.sign(payload ,secret , options )
}

export const verifyToken = async ({
    token = " " ,
    secret = ACCESS_USER_TOKEN_SIGNATURE
} = {})=>{
    return jwt.verify(token , secret)
}
const getTokenSignature = async (role = RoleEnum.USER)=>{
    let signature ;
    switch (role) {
        case RoleEnum.ADMIN:
            signature = {accessSignature : ACCESS_ADMIN_TOKEN_SIGNATURE , refreshSignature : REFRESH_ADMIN_TOKEN_SIGNATURE}
            break;
        default:
            signature = {accessSignature : ACCESS_USER_TOKEN_SIGNATURE , refreshSignature : REFRESH_USER_TOKEN_SIGNATURE}
            break;
    }
    return signature;
}
const getSignature = async ({tokenType = TokenTypeEnum.ACCESS , role=RoleEnum.USER} = {} )=>{
    const signature = await getTokenSignature(role);
    return tokenType == TokenTypeEnum.ACCESS ? signature.accessSignature : signature.refreshSignature;
}

export const decodeToken = async ({
    authorization = "",
    tokenType = TokenTypeEnum.ACCESS
})=>{
    const decodded = jwt.decode(authorization);
    if(!decodded?.aud?.length){
        throw BadReaquestException({message : "missing token payload"});
    }
    const payload = await verifyToken({
        token : authorization,
        secret : await getSignature({tokenType : tokenType , role:decodded.aud[0]})
    });
    if(!payload?.sub) throw BadReaquestException({message : "missing token payload"});
    const user = await findById({
        id : payload.sub,
        model:UserModel
    })
    if(!user) throw NotFoundException({message : "Invalid User"});
    return {user , payload};
}

export const createLoginCradential = async ({
    user,
    options = {}
})=>{
    const {accessSignature , refreshSignature} = await getTokenSignature(user.role)
    const access_token = await createToken({
        payload :{sub : user._id},
        secret : accessSignature,
        options:{
            ...options,
            audience: [ user.role],
            expiresIn: ACCESS_TOKEN_EXPIRES_IN
        }
    })
    const refresh_token = await createToken({
        payload:{sub : user._id},
        secret : refreshSignature,
        options:{
            ...options,
            audience: [ user.role],
            expiresIn: REFRESH_TOKEN_EXPIRES_IN
        },
    })
    return {access_token , refresh_token};
}

export const basicAuth = async ({email , password})=>{
    const user = await findOne({
        filter: {email},
        option: {select : "email"},
        model:UserModel
    })
    if(!user){
        throw NotFoundException({message:"Invalid Email Or Password"});
    }
    const match = await compare(password  , user.password);
    if(!match) throw NotFoundException({message:"Invalid Email Or Password"});
    return user;
}