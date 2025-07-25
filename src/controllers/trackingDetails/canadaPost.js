import xml2js from "xml2js";
import { stripPrefix } from "../../utils/xml.utils.js";

export async function fetchTrackingEvents(trackingNumber) {
  const response = await fetch(`https://soa-gw.canadapost.ca/vis/track/pin/${trackingNumber}/detail?locale=en_CA`, {
    method: "GET",
    headers: {
      Authorization: `Basic ${Buffer.from(`${process.env.CANADA_POST_API_USERNAME}:${process.env.CANADA_POST_API_PASSWORD}`).toString("base64")}`,
      Accept: "application/vnd.cpc.track+xml",
      "Accept-Language": "en-CA",
    },
  });
  if (!response.ok) {
    const error = new Error(`Failed to fetch from Canada Post API: ${response.statusText}`);
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
        const error = new Error("Failed to fetch from Canada Post API: Parse failed");
        error.status = 500;
        error.title = "Fetch failed";

        throw error;
      }

      console.log(JSON.stringify(result, null, 2));

      if (result["messages"] && result["messages"]["message"]) {
        const error = new Error("Failed to fetch from Canada Post API: No tracking events found.");
        error.status = 404;
        error.title = "Fetch failed";

        throw error;
      }

      try {
        const events = result["tracking-detail"]["significant-events"]?.occurrence || [];
        const eventList = Array.isArray(events) ? events : [events];
        eventList
          .map((event) => ({
            description: event["event-description"],
            date: `${event["event-date"]} ${event["event-time"]}`,
            address: {
              city: event["event-site"],
              province: event["event-province"],
            },
          }))
          .forEach((event) => trackingEvents.push(event));
      } catch (_error) {
        const error = new Error("Failed to fetch from Canada Post API: Parse failed");
        error.status = 500;
        error.title = "Fetch failed";
      }
    },
  );

  return trackingEvents;
}
