import mongoose from "mongoose"
import { DB_URI } from "../config.js"
import { UserModel } from "./model/index.js";

export const bootstrap = async (app , port)=>{
    try {
        await mongoose.connect(DB_URI);
        console.log("DB Connection Successfully ✔️");
        await UserModel.syncIndexes();
        app.listen(port, () => console.log(`Example app listening on port ${port}!`))
    } catch (error) {
        console.log({error});
        console.log("Fail TO Connection DB ❌");
    }
}