export function getRates(req, res, next) {
  const { shippingto, items } = req.body;

  const missingFields = [];
  if (!shippingto) missingFields.push("shippingto");
  if (!items) missingFields.push("items");
  if (missingFields.length > 0)
    return next({
      status: 400,
      title: "Missing required fields",
      message: `Missing required fields: ${missingFields.join(",")}`,
    });

  const isSample = items.every((item) => item.sku.toLowerCase() === "sample-1");
  const shippingmethods = isSample ? [{ methodname: process.env.CANADA_POST_LETTERMAIL_NAME, rate: 0 }] : [];
  return res.status(200).json({
    message: "Shipping rates retrieved successfully",
    shippingmethods,
  });
}
