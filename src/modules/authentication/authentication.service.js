import { ConflictException, NotFoundException } from "../../common/exceptions/index.js";
import { create, findOne } from "../../common/repository/index.js";
import { compare, decrypt, encrypt, hash } from "../../common/security/index.js";
import { UserModel } from "../../DB/model/index.js"

export const signup = async ({userName , email , password , phone}) => {
    const duplicatedAccount = await findOne({
        filter: {email},
        option: {select : "email"},
        model:UserModel
    })
    if(duplicatedAccount){
        throw ConflictException({message:"Email Exist"});
    }
    const user = await create({
        data:{
            userName , 
            email , 
            password: await hash(password),
            phone: await encrypt(phone)
        },
        model: UserModel
    });
    return user;
}

export const login = async({email , password}) => {
    const account = await findOne({
        filter: {email},
        option: {select : "email"},
        model:UserModel
    })
    if(!account){
        throw NotFoundException({message:"Invalid Email Or Password"});
    }
    const match = await compare(password  , account.password);
    if(!match) throw NotFoundException({message:"Invalid Email Or Password"});
    account.phone = await decrypt(account.phone)
    return account;
}