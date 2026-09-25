import mongoose from "mongoose";
import { GenderEnum, ProviderEnum, RoleEnum } from "../../common/enum/index.js";

const UserSchema = new mongoose.Schema({
    firstName:{
        type:String,
        required:true,
        minLength:2,
        MaxLength:25
    },
    lastName:{
        type:String,
        required:true,
        minLength:2,
        MaxLength:25
    },
    email:{
        type:String,
        unique:true,
        required : true
    },
    password:{
        type:String,
        required:function(){
            return this.provider === ProviderEnum.SYSTEM
        }
    },
    DOB: Date,
    phone:String,
    confirmEmail : Date,
    image:String,
    coverImage:[String],
    gender:{
        type:Number,
        enum:Object.values(GenderEnum),
        default: GenderEnum.MALE
    },
    role:{
        type:Number,
        enum:Object.values(RoleEnum),
        default: RoleEnum.USER
    },
    provider:{
        type:Number,
        enum:Object.values(ProviderEnum),
        default: ProviderEnum.SYSTEM
    },
},
{
    timestamps:true,
    strict:true,
    strictQuery:true,
    toObject:{virtuals : true},
    toJSON:{virtuals : true}
})

UserSchema.virtual("userName")
    .set(function(value){
        const [firstName , lastName] = value?.split(" ") || [ ];
        this.set({firstName , lastName});
    })
    .get(function(){
        return `${this.firstName} ${this.lastName}`
    })

export const  UserModel = mongoose.models.User || mongoose.model("User" , UserSchema);