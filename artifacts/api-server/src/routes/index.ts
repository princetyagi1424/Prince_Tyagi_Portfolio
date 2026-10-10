import { Router, type IRouter } from "express";
import healthRouter from "./health";
import leetcodeRouter from "./leetcode";

const router: IRouter = Router();

router.use(healthRouter);
router.use(leetcodeRouter);

export default router;
