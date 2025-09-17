import { Router } from "express";
import userRouter from "./user.route"
import authRouter from "./auth.route"
import companyRouter from "./company.route"
import cityRouter from "./city.route"
import uploadRouter from "./upload.route"

const router = Router();

router.use('/user', userRouter);
router.use('/auth', authRouter);
router.use('/company', companyRouter);
router.use('/city', cityRouter);
router.use('/upload', uploadRouter);

export default router;