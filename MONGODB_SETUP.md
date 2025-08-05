# MongoDB Setup Guide

## Environment Variables

Create a `.env` file in the `server` directory with the following variables:

```env
# MongoDB Atlas Connection String
MONGODB_URI=mongodb+srv://your_username:your_password@your_cluster.mongodb.net/travel-buddy?retryWrites=true&w=majority

# OpenRouter API Key for DeepSeek
OPENROUTER_API_KEY=your_openrouter_api_key_here

# PredictHQ API Key
PREDICTHQ_API_KEY=your_predicthq_api_key_here
```

## MongoDB Atlas Setup

1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a free cluster
3. Create a database user with read/write permissions
4. Get your connection string from the "Connect" button
5. Replace `your_username`, `your_password`, and `your_cluster` with your actual values

## Features Implemented

### Backend (server/)
- ✅ MongoDB connection with Mongoose
- ✅ PastTrip model with schema validation
- ✅ `/api/saveTrip` - Save trip suggestions to MongoDB
- ✅ `/api/getPastTrips/:userId` - Fetch user's past trips
- ✅ `/api/deleteTrip/:tripId` - Delete specific trip

### Frontend (client/)
- ✅ Automatic trip saving after DeepSeek API success
- ✅ Visual indicators for saving status
- ✅ Profile page with past trips grid layout
- ✅ Trip details modal with full suggestions
- ✅ Delete trip functionality
- ✅ Responsive design

## API Endpoints

### POST /api/saveTrip
Saves a new trip suggestion to MongoDB
```json
{
  "userId": "firebase_user_id",
  "city": "Mumbai",
  "checkIn": "2024-06-10",
  "checkOut": "2024-06-14",
  "preference": "adventure",
  "budget": 15000,
  "suggestions": { /* DeepSeek API response */ }
}
```

### GET /api/getPastTrips/:userId
Fetches all past trips for a user (sorted by creation date, limited to 20)

### DELETE /api/deleteTrip/:tripId
Deletes a specific trip by ID

## Security Features

- ✅ Input validation on all endpoints
- ✅ Error handling with appropriate HTTP status codes
- ✅ User-specific data isolation (trips are filtered by userId)
- ✅ Confirmation dialogs for destructive actions 