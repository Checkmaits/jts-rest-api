import { parseTimestamp } from "../../utils/tracking.utils.js";

let UPS_ACCESS_TOKEN = ""; // Fail first time

export async function fetchTrackingEvents(trackingNumber) {
  const response = await fetch(`https://onlinetools.ups.com/api/track/v1/details/${trackingNumber}`, {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${UPS_ACCESS_TOKEN}`,
      transactionSrc: process.env.UPS_API_TRANSACTION_SRC,
      transId: `${process.env.UPS_API_TRANSACTION_SRC}-${trackingNumber}-${Date.now()}`,
    },
  });

  if (!response.ok) {
    if (response.status === 401) {
      await refreshUPSAccessToken();
      return fetchTrackingEvents(trackingNumber);
    }

    const error = new Error(`Failed to fetch from UPS API: ${response.statusText}`);
    error.status = response.status;
    error.title = "Fetch failed";
    throw error;
  }

  const data = await response.json();
  const trackResponse = data.trackResponse.shipment[0];
  if (trackResponse.warnings && trackResponse.warnings.length > 0) {
    const error = new Error(`Failed to fetch from UPS API: ${trackResponse.warnings[0].message}`);
    error.status = 404;
    error.title = "Fetch failed";
    throw error;
  }

  return trackResponse.package[0].activity.map((event) => ({
    description: event.status.description.trim(),
    date: parseTimestamp(`${event.date} ${event.time}`).toLocaleDateString("en-CA"),
    address: {
      city: event.location.address.city,
      province: event.location.address.stateProvince,
    },
  }));
}

async function refreshUPSAccessToken() {
  const response = await fetch("https://onlinetools.ups.com/security/v1/oauth/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Accept: "application/json",
      "x-merchant-id": process.env.UPS_API_MERCHANT_ID,
      Authorization: `Basic ${btoa(`${process.env.UPS_API_CLIENT_ID}:${process.env.UPS_API_CLIENT_SECRET}`)}`,
    },
    body: new URLSearchParams({
      grant_type: "client_credentials",
    }),
  });

  UPS_ACCESS_TOKEN = (await response.json()).access_token;
}
