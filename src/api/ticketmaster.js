const ENDPOINT = "https://app.ticketmaster.com/discovery/v2/events.json";

const apiKey =
  import.meta.env.VITE_TICKETMASTER_API_KEY ??
  import.meta.env.VITE_TICKETMASTER_CONSUMER_KEY;

const normalizeEvent = (rawEvent) => {
  const venue = rawEvent._embedded?.venues?.[0] ?? {};
  const location = venue.location ?? {};
  const city = venue.city?.name ?? "";
  const state = venue.state?.stateCode ?? venue.state?.name ?? "";
  const country = venue.country?.countryCode ?? "";

  const addressParts = [
    venue.address?.line1,
    venue.address?.line2,
    city,
    state,
    venue.postalCode,
    country,
  ].filter(Boolean);

  const lineup =
    rawEvent._embedded?.attractions?.map((attraction) => attraction.name) ?? [];

  const image =
    rawEvent.images?.find((img) => img.ratio === "16_9" && img.width >= 640)
      ?.url ?? rawEvent.images?.[0]?.url;

  return {
    id: rawEvent.id,
    name: rawEvent.name,
    category: rawEvent.classifications?.[0]?.segment?.name ?? "Event",
    date:
      rawEvent.dates?.start?.dateTime ??
      rawEvent.dates?.start?.localDate ??
      "",
    city,
    state,
    venueName: venue.name ?? "Venue TBA",
    venueAddress: addressParts.join(", "),
    venuePhone: venue.boxOfficeInfo?.phoneNumberDetail ?? "",
    latitude: location.latitude ? Number(location.latitude) : undefined,
    longitude: location.longitude ? Number(location.longitude) : undefined,
    image,
    lineup,
    info:
      rawEvent.info ??
      rawEvent.pleaseNote ??
      rawEvent.promoter?.description ??
      "",
    link: rawEvent.url ?? "",
  };
};

export async function fetchEventsByCity(city) {
  if (!city) return [];

  if (!apiKey) {
    throw new Error(
      "Missing Ticketmaster API key. Set VITE_TICKETMASTER_API_KEY in your environment."
    );
  }

  const url = new URL(ENDPOINT);
  url.searchParams.set("apikey", apiKey);
  url.searchParams.set("city", city);
  url.searchParams.set("radius", "25");
  url.searchParams.set("size", "50");
  url.searchParams.set("sort", "date,asc");

  const response = await fetch(url.toString());

  if (!response.ok) {
    const text = await response.text();
    throw new Error(
      `Ticketmaster API error (${response.status}): ${
        text || response.statusText
      }`
    );
  }

  const data = await response.json();
  const events = data._embedded?.events ?? [];

  return events
    .map(normalizeEvent)
    .filter((event) => event.latitude && event.longitude);
}

export default fetchEventsByCity;

