import { Router } from "express";
import { successResponse } from "../../common/utils/index.js";
import { profile, rotate_token, update } from "./user.service.js";
import { authentication, authorization } from "../../middleware/index.js";
import { RoleEnum, TokenTypeEnum } from "../../common/enum/index.js";
const router = Router()

router.get("/",authentication() ,async(req, res, next) => {
    const account = await profile(req.user);
    return successResponse({ res, data: account })
})
router.patch("/",authentication(),authorization(RoleEnum.USER) ,async(req, res, next) => {
    const account = await update(req.user , req.body);
    return successResponse({ res,message: "Update Successfully", data: account })
})
router.post("/rotate_token",authentication(TokenTypeEnum.REFRESH) ,async(req, res, next) => {
    const account = await rotate_token(req.payload, req.user);
    return successResponse({ res ,  data: account })
})

export default router