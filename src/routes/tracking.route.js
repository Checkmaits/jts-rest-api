import { Router } from "express";
import * as controller from "../controllers/tracking.controller.js";

const router = Router();

router.get("/", controller.getTrackingInformation);

export default router;
