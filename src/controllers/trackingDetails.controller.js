import * as canpar from "./trackingDetails/canpar.js";
import * as canadaPost from "./trackingDetails/canadaPost.js";
import * as ups from "./trackingDetails/ups.js";

export async function getTrackingDetails(req, res, next) {
  const { courier, trackingNumber } = req.query;

  const missingFields = [];
  if (!courier) missingFields.push("courier");
  if (!trackingNumber) missingFields.push("trackingNumber");
  if (missingFields.length > 0)
    return next({
      status: 400,
      title: "Missing required fields",
      message: `Missing required fields: ${missingFields.join(",")}`,
    });

  try {
    const trackingEvents = await getTrackingEvents(courier, trackingNumber);
    res.status(200).json({
      message: `Tracking events retrieved successfully (${trackingNumber})`,
      data: trackingEvents,
    });
  } catch (error) {
    next(error);
  }
}

async function getTrackingEvents(courier, trackingNumber) {
  const shippingCourier = courier.toLowerCase();
  if (shippingCourier.includes("canpar")) {
    return await canpar.fetchTrackingEvents(trackingNumber);
  } else if (shippingCourier.includes("canada post")) {
    return await canadaPost.fetchTrackingEvents(trackingNumber);
  } else if (shippingCourier.includes("ups")) {
    return await ups.fetchTrackingEvents(trackingNumber);
  }
}
