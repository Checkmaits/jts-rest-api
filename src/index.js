import { config } from "dotenv";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";

// Routes
import featuredBrandRoute from "./routes/featuredBrand.route.js";
import featuredCategoryRoute from "./routes/featuredCategory.route.js";
import quantityPricingRoute from "./routes/quantityPricing.route.js";
import ratesRoute from "./routes/rates.route.js";
import trackingRoute from "./routes/tracking.route.js";
import trackingDetailsRoute from "./routes/trackingDetails.route.js";

import packageJson from "../package.json" with { type: "json" };
import { connectToMongoDB } from "./utils/db.utils.js";

config();

export const app = express();
app.use(cors());
app.use(helmet());
app.use(morgan("dev")); // for development purposes only...
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set("trust proxy", 1);
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 150,
    handler: (req, res, next) =>
      next({
        status: 429,
        title: "Too many requests",
        message: "You've sent too many requests in a short period. Please try again later.",
      }),
  }),
);

app.use("/api/v1/featured-brands", featuredBrandRoute);
app.use("/api/v1/featured-categories", featuredCategoryRoute);
app.use("/api/v1/quantity-pricing", quantityPricingRoute);
app.use("/api/v1/rates", ratesRoute);
app.use("/api/v1/tracking", trackingRoute);
app.use("/api/v1/tracking-details", trackingDetailsRoute);

app.get("/", (_, res) => res.status(200).json({ message: `JT's Outdoor Fabrics REST API v${packageJson.version}` }));

app.use((req, res, next) =>
  next({
    status: 404,
    title: "Endpoint not found",
    message: "The requested endpoint was not found. Please check the URL and try again.",
  }),
);

app.use((error, req, res, next) => {
  const {
    status = 500,
    title = "Internal server error",
    message = "An error occurred whilst processing your request. Please try again later.",
  } = error;

  res.status(status).json({
    status,
    title,
    message,
  });
});

connectToMongoDB(() => {
  const port = process.env.PORT || 1234;
  app.listen(port, () => {
    console.log(`JT's REST API >> Connecting to MongoDB...`);
    console.log(`JT's REST API >> Listening on port ${port}...`);
  });
});
