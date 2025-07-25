import { Router } from "express";
import * as controller from "../controllers/rates.controller.js";

const router = Router();

router.post("/", controller.getRates);

export default router;
