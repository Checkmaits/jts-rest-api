import FeaturedCategory from "../models/featuredCategory.model.js";

export async function getFeaturedCategories(req, res, next) {
  try {
    const featuredCategories = await FeaturedCategory.find({}).exec();
    res.status(200).json({
      message: `${featuredCategories.length} FeaturedCategory entries retrieved successfully.`,
      data: featuredCategories,
    });
  } catch (error) {
    next(new Error());
  }
}
