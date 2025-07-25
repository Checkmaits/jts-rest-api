import { Router } from "express";
import * as controller from "../controllers/quantityPricing.controller.js";

const router = Router();

router.get("/:catalogId", controller.getQuantityPricing);

export default router;
