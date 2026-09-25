import { ProviderEnum } from "../../common/enum/index.js";
import { BadReaquestException, ConflictException, NotFoundException } from "../../common/exceptions/index.js";
import { create, findOne } from "../../common/repository/index.js";
import { compare, createLoginCradential, encrypt, hash } from "../../common/security/index.js";
import { WEB_CLIENT_ID } from "../../config.js";
import { UserModel } from "../../DB/model/index.js"
import {OAuth2Client} from 'google-auth-library';

const client = new OAuth2Client();
async function verifyGoogleAccount(idToken) {
    const ticket = await client.verifyIdToken({
        idToken,
        audience: WEB_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    if(!payload.email_verified){
        throw BadReaquestException({message : "Email Not Verified"})
    }
    return payload
}
export const signupWithGmail = async ({idToken}) => {
    const {email , name , picture} = await verifyGoogleAccount(idToken);
    const duplicatedAccount = await findOne({
        filter : {email},
        model : UserModel,
    })
    if(duplicatedAccount){
        if(duplicatedAccount.provider != ProviderEnum.GOOGLE) throw ConflictException({message:"Invalid account"});
        return {status : 200 , data : createLoginCradential({user : duplicatedAccount})};
    }
    const user = await create({
        data:{
            userName : name,
            email : email,
            image : picture,
            confirmEmail : new Date(),
            provider : ProviderEnum.GOOGLE
        },
        model : UserModel
    })
    return {status : 201 , data : createLoginCradential({user})};
}

export const signup = async (inputs) => {
    const {password , phone} = inputs
    const duplicatedAccount = await findOne({
        filter: {email : inputs.email},
        option: {select : "email"},
        model:UserModel
    })
    if(duplicatedAccount){
        throw ConflictException({message:"Email Exist"});
    }
    const user = await create({
        data:{
            ...inputs,
            password : await hash(password),
            phone: await encrypt(phone),
        },
        model: UserModel
    });
    return user;
}

export const login = async({email , password}) => {
    const account = await findOne({
        filter: {email , provider : ProviderEnum.SYSTEM},
        option: {select : "email"},
        model:UserModel
    })
    if(!account){
        throw NotFoundException({message:"Invalid Email Or Password"});
    }
    const match = await compare(password  , account.password);
    if(!match) throw NotFoundException({message:"Invalid Email Or Password"});
    return await createLoginCradential({user:account})
}