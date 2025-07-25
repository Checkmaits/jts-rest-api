import { Router } from "express";
import * as controller from "../controllers/featuredCategory.controller.js";

const router = Router();

router.get("/", controller.getFeaturedCategories);

export default router;
