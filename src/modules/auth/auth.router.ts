import { Router } from "express";
import { userController } from "./auth.controller";

const router = Router();

router.post("/signup", userController.signupUser);


export const authRouter = router;