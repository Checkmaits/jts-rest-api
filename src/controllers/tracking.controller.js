export async function getTrackingInformation(req, res, next) {
  const { orderNumber, postalCode } = req.query;

  const missingFields = [];
  if (!orderNumber) missingFields.push("orderNumber");
  if (!postalCode) missingFields.push("postalCode");
  if (missingFields.length > 0)
    return next({
      status: 400,
      title: "Missing required fields",
      message: `Missing required fields: ${missingFields.join(",")}`,
    });

  const invoicePrefix = orderNumber.charAt(0);
  const invoiceNumber = orderNumber.substring(1);
  const response = await fetch(
    `${process.env.API_REQUEST_URL}/Orders/?invoiceprefix=${invoicePrefix}&invoicenumber=${invoiceNumber}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/xml",
        Accept: "application/json",
        SecureURL: process.env.API_SECURE_URL,
        PrivateKey: process.env.API_PRIVATE_KEY,
        Token: process.env.API_TOKEN,
      },
    },
  );

  if (!response.ok) {
    return next({
      status: response.status,
      title: "Fetch failed",
      message: `Failed to fetch order details (${orderNumber}): ${response.statusText}`,
    });
  }

  const data = (await response.json())[0];
  const shipmentData = data.ShipmentList[0];
  if (normalizePostalCode(postalCode) !== normalizePostalCode(shipmentData["ShipmentZipCode"])) {
    return next({
      status: 400,
      title: "Invalid postal code",
      message: `Invalid postal code provided (${postalCode}). Please check the postal code and try again.`,
    });
  }

  return res.status(200).json({
    message: `Tracking information retrieved successfully (${orderNumber})`,
    data: {
      order_status_id: data["OrderStatusID"],
      shipment_address: {
        name: `${shipmentData["ShipmentFirstName"]} ${shipmentData["ShipmentLastName"]}`,
        street1: shipmentData["ShipmentAddress"],
        street2: shipmentData["ShipmentAddress2"],
        city: shipmentData["ShipmentCity"],
        province: shipmentData["ShipmentState"],
        postal_code: shipmentData["ShipmentZipCode"],
        country: shipmentData["ShipmentCountry"],
      },
      shipment_method: shipmentData["ShipmentMethodName"],
      tracking_numbers: parseTrackingCode(shipmentData["ShipmentTrackingCode"], shipmentData["ShipmentMethodName"]),
    },
  });
}

function normalizePostalCode(postalCode) {
  return postalCode.toLowerCase().replace(/\s+/g, "");
}

function parseTrackingCode(trackingCode, shipmentMethod) {
  const trackingNumbers = [];
  const isCanpar = shipmentMethod.toLowerCase().includes("canpar");

  if (trackingCode.includes("-")) {
    const parts = trackingCode.split("-");

    if (isCanpar) {
      const prefix = parts[0].slice(0, -4);
      trackingNumbers.push(parts[0]);
      for (let i = 1; i < parts.length; i++) {
        trackingNumbers.push(`${prefix}${parts[i]}`);
      }
    } else {
      trackingNumbers.push(...parts);
    }
  } else {
    trackingNumbers.push(trackingCode);
  }

  return trackingNumbers;
}
