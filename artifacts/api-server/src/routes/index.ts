import { Router, type IRouter } from "express";
import healthRouter from "./health.js";
import propertiesRouter from "./properties.js";
import favoritesRouter from "./favorites.js";
import statsRouter from "./stats.js";

const router: IRouter = Router();

router.use(healthRouter);
router.use(propertiesRouter);
router.use(favoritesRouter);
router.use(statsRouter);

export default router;
