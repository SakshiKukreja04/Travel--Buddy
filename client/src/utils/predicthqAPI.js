const backendUrl = import.meta.env.VITE_BACKEND_URL;

/* ---------- utils/predicthqAPI.js ---------- */

/* Call our backend */
export async function fetchPredictHQEvents(city, checkin, checkout) {
  const res = await fetch(`${backendUrl}/api/predicthq-events`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ city, checkin, checkout }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'PredictHQ request failed');
  return data.events;
}

/* Tiny helpers for UI */
export function getEventCategoryIcon(cat) {
  const map = {
    concerts: '🎵',
    sports: '🏟️',
    festivals: '🎉',
    community: '🤝',
    conferences: '🎤',
    expos: '🏢',
    performing: '🎭',
  };
  return map[cat] || '📅';
}

export function getAttendanceLabel(num = 0) {
  if (num < 100) return 'Small event (< 100)';
  if (num < 1000) return 'Medium event (100‑1K)';
  if (num < 10000) return 'Large event (1K‑10K)';
  return 'Massive event (10K+)';
}

export function formatEventDate(iso) {
  return new Date(iso).toLocaleString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

