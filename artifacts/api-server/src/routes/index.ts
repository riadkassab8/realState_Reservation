import { Router, type IRouter } from "express";
import healthRouter from "./health";
import propertiesRouter from "./properties";
import favoritesRouter from "./favorites";
import statsRouter from "./stats";

const router: IRouter = Router();

router.use(healthRouter);
router.use(propertiesRouter);
router.use(favoritesRouter);
router.use(statsRouter);

export default router;
