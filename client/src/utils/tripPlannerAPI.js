export async function getTripSuggestions({ city, checkIn, checkOut, preference, budget }) {
  const response = await fetch('http://localhost:3001/api/deepseek-trip', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ city, checkin: checkIn, checkout: checkOut, preference, budget })
  });

  if (!response.ok) {
    throw new Error('Failed to fetch trip suggestions');
  }

  const data = await response.json();
  // Extract the model's reply (should be JSON string)
  const content = data.choices?.[0]?.message?.content;
  try {
    return JSON.parse(content);
  } catch (e) {
    // fallback: return raw content
    return content;
  }
} 