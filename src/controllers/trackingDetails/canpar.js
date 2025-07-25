import xml2js from "xml2js";
import { stripPrefix } from "../../utils/xml.utils.js";
import { parseTimestamp } from "../../utils/tracking.utils.js";

export async function fetchTrackingEvents(trackingNumber) {
  const body = getRequestBody(trackingNumber);
  const response = await fetch("https://canship.canpar.com/canshipws/services/CanparAddonsService", {
    method: "POST",
    headers: {
      "Content-Type": "application/soap+xml; charset=utf-8",
      "Content-Length": Buffer.byteLength(body).toString(),
      SOAPAction: "", // sometimes required, leave blank if not
    },
    body,
  });

  if (!response.ok) {
    const error = new Error(`Failed to fetch from Canpar API: ${response.statusText}`);
    error.status = response.status;
    error.title = "Fetch failed";

    throw error;
  }

  const trackingEvents = [];
  xml2js.parseString(
    await response.text(),
    {
      explicitArray: false,
      ignoreAttrs: false,
      tagNameProcessors: [stripPrefix],
    },
    (err, result) => {
      if (err) {
        const error = new Error("Failed to fetch from Canpar API: Parse failed");
        error.status = 500;
        error.title = "Fetch failed";

        throw error;
      }

      console.log(JSON.stringify(result, null, 2));

      const trackingResult = result["Envelope"]["Body"]["trackByBarcodeResponse"]["return"]["result"];
      const events = trackingResult["events"];
      if (!events || !Array.isArray(events) || events.length === 0) {
        const error = new Error("Failed to fetch from Canpar API: No tracking events found.");
        error.status = 404;
        error.title = "Fetch failed";

        throw error;
      }

      const eventArray = Array.isArray(events) ? events : [events];
      eventArray
        .map((e) => ({
          description: e["code_description_en"],
          date: parseTimestamp(e["local_date_time"]).toLocaleDateString("en-CA"),
          address: {
            street: e["address"]["address_line_1"],
            street2: e["address"]["address_line_2"],
            street3: e["address"]["address_line_3"],
            city: e["address"]["city"],
            province: e["address"]["province"],
          },
        }))
        .forEach((e) => trackingEvents.push(e));
    },
  );

  return trackingEvents;
}

function getRequestBody(trackingNumber) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope"
               xmlns:ws="http://ws.canparaddons.canpar.com"
               xmlns:xsd="http://ws.dto.canshipws.canpar.com/xsd">
  <soap:Header/>
  <soap:Body>
    <ws:trackByBarcode>
      <ws:request>
        <xsd:barcode>${trackingNumber}</xsd:barcode>
        <xsd:track_shipment>0</xsd:track_shipment>
      </ws:request>
    </ws:trackByBarcode>
  </soap:Body>
</soap:Envelope>`;
}
