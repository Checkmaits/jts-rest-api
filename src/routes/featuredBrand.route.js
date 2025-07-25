import { Router } from "express";
import * as controller from "../controllers/featuredBrand.controller.js";

const router = Router();

router.get("/", controller.getFeaturedBrands);

export default router;
