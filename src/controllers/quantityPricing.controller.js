export async function getQuantityPricing(req, res, next) {
  const { catalogId } = req.params;
  if (!catalogId) {
    return next({
      status: 400,
      title: "Invalid Catalog ID",
      message: "Invalid Catalog ID provided. Please check the ID and try again.",
    });
  }

  const { API_PRIVATE_KEY, API_REQUEST_URL, API_SECURE_URL, API_TOKEN } = process.env;
  const request = await fetch(`${API_REQUEST_URL}/Products/${catalogId}/Discount`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      SecureURL: API_SECURE_URL,
      PrivateKey: API_PRIVATE_KEY,
      Token: API_TOKEN,
    },
  });

  if (!request.ok) {
    return next({
      status: request.status,
      title: "Fetch failed",
      message: `Unable to fetch product quantity pricing: ${response.statusText}`,
    });
  }

  res.status(200).json({
    message: `Quantity pricing retrieved successfully (ID: ${catalogId})`,
    data: await request.json(),
  });
}
