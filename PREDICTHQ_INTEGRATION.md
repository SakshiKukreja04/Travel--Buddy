# PredictHQ API Integration

This document explains how to set up and use the PredictHQ API integration in the Travel Buddy application.

## Overview

The PredictHQ API integration allows the Travel Buddy app to fetch real-time local events from PredictHQ's comprehensive event database. This provides users with information about concerts, festivals, conferences, sports events, and other local happenings during their travel dates.

## Features

- **Real-time Event Data**: Fetches live event information from PredictHQ's database
- **Geographic Filtering**: Events are filtered by location (within 50km of the destination city)
- **Date Range Filtering**: Events are filtered by check-in and check-out dates
- **Rich Event Information**: Displays event details including:
  - Event name and description
  - Date and time
  - Venue information
  - Expected attendance
  - Event category
  - Direct links to event pages

## Setup Instructions

### 1. Get PredictHQ API Key

1. Sign up for a PredictHQ account at [https://www.predicthq.com/](https://www.predicthq.com/)
2. Navigate to your account settings
3. Generate an API key
4. Copy the API key for use in the application

### 2. Configure Environment Variables

Create a `.env` file in the `server/` directory with the following variables:

```env
# PredictHQ API Configuration
PREDICTHQ_API_KEY=your_actual_predicthq_api_key_here

# OpenWeatherMap API Key (optional, for geocoding)
OPENWEATHER_API_KEY=your_openweather_api_key_here

# OpenRouter API Key (existing)
OPENROUTER_API_KEY=your_openrouter_api_key_here
```

### 3. Install Dependencies

The required dependencies are already included in the project. Make sure to run:

```bash
cd server
npm install
```

### 4. Start the Server

```bash
cd server
npm start
```

## API Endpoints

### POST /api/predicthq-events

Fetches events from PredictHQ API based on location and date range.

**Request Body:**
```json
{
  "city": "Mumbai",
  "checkin": "2024-06-15",
  "checkout": "2024-06-20"
}
```

**Response:**
```json
{
  "success": true,
  "events": [
    {
      "id": "event_id",
      "name": "Event Name",
      "description": "Event description",
      "start": {
        "local": "2024-06-15T19:00:00",
        "timezone": "Asia/Kolkata"
      },
      "end": {
        "local": "2024-06-15T22:00:00",
        "timezone": "Asia/Kolkata"
      },
      "venue": {
        "name": "Venue Name",
        "address": "Venue Address"
      },
      "category": "concerts",
      "rank": 85,
      "local_rank": 12,
      "phq_attendance": 2500,
      "url": "https://event-url.com"
    }
  ],
  "total": 1
}
```

## Frontend Integration

The PredictHQ events are displayed in the TripSuggestions page. The events are shown in a modern card layout with:

- Event category icons
- Event titles with links
- Date and time information
- Venue details
- Expected attendance estimates
- Event descriptions
- Category badges

## Event Categories

The integration supports various event categories with appropriate icons:

- 🎵 Concerts
- 🎤 Conferences
- 🏢 Expos
- 🎉 Festivals
- ⚽ Sports
- 👥 Community
- 🎭 Performing Arts
- 😄 Comedy
- 👨‍👩‍👧‍👦 Family
- 🍽️ Food and Drink
- 💼 Business
- 📚 Education
- 🏥 Health
- 💻 Technology
- 👗 Fashion
- 🎬 Film
- 🎼 Music
- 📅 Other

## Error Handling

The integration includes comprehensive error handling:

- API key validation
- Network error handling
- Invalid response handling
- User-friendly error messages

## Rate Limiting

PredictHQ API has rate limits. The integration fetches up to 20 events per request to stay within limits.

## Troubleshooting

### Common Issues

1. **"PredictHQ API key not configured"**
   - Ensure the `PREDICTHQ_API_KEY` is set in your `.env` file
   - Restart the server after adding the environment variable

2. **"Failed to fetch events from PredictHQ"**
   - Check your internet connection
   - Verify your API key is valid
   - Check PredictHQ service status

3. **No events found**
   - The location might not have events during the specified dates
   - Try expanding the date range
   - Check if the city name is correctly spelled

### Debug Mode

To enable debug logging, add this to your server's console.log statements:

```javascript
console.log('PredictHQ API Key loaded:', process.env.PREDICTHQ_API_KEY ? 'YES' : 'NO');
```

## Security Considerations

- Never commit your API keys to version control
- Use environment variables for sensitive data
- The API key is only used server-side
- All API calls are made from the backend to protect the key

## Future Enhancements

Potential improvements for the PredictHQ integration:

1. Event filtering by category
2. Event sorting by popularity/rank
3. Event recommendations based on user preferences
4. Integration with the trip itinerary
5. Event notifications and reminders
6. Event booking integration 