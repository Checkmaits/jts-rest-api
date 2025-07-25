import FeaturedBrand from "../models/featuredBrand.model.js";

export async function getFeaturedBrands(req, res, next) {
  try {
    const featuredBrands = await FeaturedBrand.find({}).exec();
    res.status(200).json({
      message: `${featuredBrands.length} FeaturedBrand entries retrieved successfully.`,
      data: featuredBrands,
    });
  } catch (error) {
    next(new Error());
  }
}
