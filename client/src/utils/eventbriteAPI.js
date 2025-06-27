export async function fetchEventbriteEvents(city, startDate, endDate) {
  const apiKey = import.meta.env.VITE_EVENTBRITE_API_KEY;
  if (!apiKey) throw new Error("Eventbrite API key not found.");

  const url = `https://www.eventbriteapi.com/v3/events/search/?location.address=${encodeURIComponent(city)}&start_date.range_start=${startDate}T00:00:00Z&start_date.range_end=${endDate}T23:59:59Z&expand=venue`;

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${apiKey}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch events from Eventbrite");
  }

  const data = await response.json();
  return data.events || [];
} 