import { Router } from "express";
import { login, signup, signupWithGmail } from "./authentication.service.js";
import { successResponse } from "../../common/utils/index.js";
import * as validators from './authentication.validation.js'
import { validation } from "../../middleware/index.js";
const router = Router();

router.post("/signup-with-gmail", async (req, res, next) => {
    const {status , data} = await signupWithGmail(req.body)
    return successResponse({ res, status, data })
})

router.post("/signup",validation(validators.signup), async (req, res, next) => {
    const data = await signup(req.validate)
    return successResponse({ res, status: 201, data })
})

router.post("/login",validation(validators.login), async (req, res, next) => {
    const data = await login(req.validate)
    return successResponse({ res, data })
})

export default router