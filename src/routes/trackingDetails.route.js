import { Router } from "express";
import * as controller from "../controllers/trackingDetails.controller.js";

const router = Router();

router.get("/", controller.getTrackingDetails);

export default router;
