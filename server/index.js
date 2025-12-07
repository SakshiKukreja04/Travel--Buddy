const express = require('express');
const cors = require('cors');
const axios = require('axios');
const mongoose = require('mongoose');
require('dotenv').config();

const PastTrip = require('./models/PastTrip');

const app = express();
const PORT = process.env.PORT || 3001;

// CORS setup for Vercel frontend
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'https://travel-buddy-orpin.vercel.app',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};
app.use(cors(corsOptions));
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Connected to MongoDB Atlas'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

// Root route for Render health check
app.get('/', (req, res) => {
  res.send('Backend is running!');
});

app.get('/api/test', (req, res) => {
  res.json({ message: 'Hello from the backend!' });
});

app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  console.log('Login attempt:', { email });
  res.json({ success: true, message: 'Login successful (dummy)' });
});

app.post('/api/signup', (req, res) => {
  const { email, password } = req.body;
  console.log('Signup attempt:', { email });
  res.json({ success: true, message: 'Signup successful (dummy)' });
});

console.log('Loaded OpenRouter API Key:', process.env.OPENROUTER_API_KEY ? 'YES' : 'NO');
console.log('Using OpenRouter API Key:', process.env.OPENROUTER_API_KEY?.slice(0, 8));

app.post('/api/deepseek-trip', async (req, res) => {
  const { city, checkin, checkout, preference, budget } = req.body;
  const preferenceText = Array.isArray(preference) ? preference.join(', ') : preference;

  const prompt = `You are a smart travel planner.
Plan a 5-day budget-friendly trip to ${city} for a traveler who prefers ${preferenceText} experiences.
The stay is from ${checkin} to ${checkout}. The total budget is ₹${budget}.

Reply in valid JSON with these keys only: hotels, meals, itinerary, estimatedTotal, packingList.
- hotels: array of at least 3 hotels (name, type, location, totalCost, features[])
- meals: for breakfast, lunch, dinner (cuisineType, famousDish, minCost, recommendedRestaurants[])
- itinerary: day-wise plan with date labels, each place/activity with minTransportCost
- estimatedTotal: object with breakdown and total
- packingList: array of items based on weather
No extra text, no markdown, just the JSON object as response.`;

  try {
    // Prefer the explicit API host and include stricter logging for debugging
    const response = await axios.post('https://api.openrouter.ai/v1/chat/completions', {
      model: 'deepseek/deepseek-chat',
      messages: [
        { role: 'user', content: prompt }
      ]
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    res.json(response.data);
  } catch (error) {
    // Log useful diagnostics to help pinpoint why OpenRouter returns 404
    console.error('❌ Error in /api/deepseek-trip: ', error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Headers:', error.response.headers);
      console.error('Data:', JSON.stringify(error.response.data));
    }

    // Provide a hint to the client (avoid leaking keys)
    const msg = (error.response && error.response.data && (error.response.data.error || error.response.data.message))
      ? error.response.data.error || error.response.data.message
      : 'Failed to fetch trip suggestions from OpenRouter';

    res.status(500).json({ error: msg });
  }
});

// Lightweight health/check endpoint to validate OpenRouter credentials and list available models
app.get('/api/openrouter-check', async (req, res) => {
  try {
    const resp = await axios.get('https://api.openrouter.ai/v1/models', {
      headers: { Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}` }
    });
    // Return a small subset so logs don't get noisy
    const ids = (resp.data && Array.isArray(resp.data.models))
      ? resp.data.models.slice(0, 20).map(m => ({ id: m.id, description: m.description || null }))
      : resp.data;
    res.json({ success: true, models: ids });
  } catch (err) {
    console.error('OpenRouter check error:', err.message);
    if (err.response) console.error('OpenRouter check data:', err.response.data);
    res.status(500).json({ success: false, error: err.response ? err.response.data : err.message });
  }
});

/* =========================================================
   P R E D I C T H Q   E V E N T S
   ========================================================= */
   app.post('/api/predicthq-events', async (req, res) => {
    const { city, checkin, checkout } = req.body;
    const PREDICTHQ_API_KEY = process.env.PREDICTHQ_API_KEY;
  
    if (!PREDICTHQ_API_KEY)
      return res.status(500).json({ error: 'PredictHQ key missing' });
  
    try {
      /* 1️⃣  Get lat/lon with free OpenStreetMap Nominatim */
      const geoResp = await axios.get(
        'https://nominatim.openstreetmap.org/search',
        {
          params: {
            format: 'json',
            q: city,
            limit: 1
          },
          headers: {
            'User-Agent': 'https://github.com/SakshiKukreja04/Travel--Buddy', // Replace with your email or GitHub
            'Referer': 'https://travel-buddy-orpin.vercel.app'              // Replace with your actual frontend URL
          }
        }
      );
      const geoJson = geoResp.data;
      if (!geoJson.length) throw new Error('City not found by geocoder');
  
      const { lat, lon, display_name } = geoJson[0];
  
      /* 2️⃣  Query PredictHQ — return LOCAL start/end times */
      const startIso = new Date(checkin).toISOString();
      const endIso   = new Date(checkout).toISOString();
  
      const phqResp = await axios.get(
        `https://api.predicthq.com/v1/events?within=50km@${lat},${lon}` +
          `&start.gte=${startIso}&start.lte=${endIso}` +
          `&limit=20&utc_offset=local`,
        {
          headers: {
            Authorization: `Bearer ${PREDICTHQ_API_KEY}`,
            Accept: 'application/json',
          },
        }
      );
      if (phqResp.status !== 200) {
        throw new Error(`PredictHQ ${phqResp.status}`);
      }
      
  
      const { results } = phqResp.data;
  
      /* 3️⃣  Shape for the React front‑end */
      const events = results.map(e => ({
        id: e.id,
        name: e.title,
        description: e.description || '',
        start: e.start,      // already local
        end: e.end,
        category: e.category,
        venue: {
          name:  e.entities?.[0]?.name || 'TBD',
          address: e.entities?.[0]?.formatted_address || 'TBD',
        },
        phq_attendance: e.phq_attendance,
        url: e.url || null,
        cityDisplay: display_name,
      }));
  
      res.json({ success: true, events });
    } catch (err) {
      console.error('❌ Error in /api/predicthq-events:', err);
      res.status(500).json({ error: 'PredictHQ fetch failed', details: err.message });
    }
  });

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);

}); 

/* =========================================================
   P A S T   T R I P S   M A N A G E M E N T
   ========================================================= */

// Save a new trip suggestion
app.post('/api/saveTrip', async (req, res) => {
  try {
    const { userId, city, checkIn, checkOut, preference, budget, suggestions } = req.body;

    console.log('Sending to /api/saveTrip:', { userId, city, checkIn, checkOut, preference, budget, suggestions });

    if (!userId || !city || !checkIn || !checkOut || !preference || !budget || !suggestions) {
      console.log('Missing required fields:', {
        userId: !!userId,
        city: !!city,
        checkIn: !!checkIn,
        checkOut: !!checkOut,
        preference: !!preference,
        budget: !!budget,
        suggestions: !!suggestions
      });
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const newTrip = new PastTrip({
      userId,
      city,
      checkIn,
      checkOut,
      preference: Array.isArray(preference) ? preference : [preference],
      budget: Number(budget),
      suggestions
    });

    const savedTrip = await newTrip.save();
    console.log("✅ Trip saved:", savedTrip._id);
    res.status(201).json({ success: true, trip: savedTrip });

  } catch (error) {
    console.error("❌ Error in saveTrip:", error);
    res.status(500).json({ error: 'Failed to save trip', details: error.message });
  }
});

// Get all past trips for a user
app.get('/api/getPastTrips/:userId', async (req, res) => {
  console.log('--- getPastTrips endpoint hit ---');
  try {
    console.log('Request params:', req.params);
    const { userId } = req.params;

    if (!userId) {
      console.log('User ID is missing!');
      return res.status(400).json({ error: 'User ID is required' });
    }

    console.log('Querying PastTrip for userId:', userId);
    const trips = await PastTrip.find({ userId })
      .sort({ createdAt: -1 })
      .limit(20);

    console.log('Trips found:', trips.length);
    res.json({ success: true, trips });
  } catch (error) {
    console.error('Error fetching past trips:', error);
    res.status(500).json({ error: 'Failed to fetch past trips', details: error.message || error.toString() });
  }
});

// Delete a specific trip
app.delete('/api/deleteTrip/:tripId', async (req, res) => {
  try {
    const { tripId } = req.params;
    
    if (!tripId) {
      return res.status(400).json({ error: 'Trip ID is required' });
    }

    const deletedTrip = await PastTrip.findByIdAndDelete(tripId);
    
    if (!deletedTrip) {
      return res.status(404).json({ error: 'Trip not found' });
    }

    res.json({ success: true, message: 'Trip deleted successfully' });
  } catch (error) {
    console.error('Error deleting trip:', error);
    res.status(500).json({ error: 'Failed to delete trip' });
  }
});

// Hotel Image Fetch Route
app.post('/api/fetchHotelImage', async (req, res) => {
  const { hotelName, city } = req.body;
  const query = city ? `${hotelName}, ${city}` : hotelName;

  try {
    const response = await axios.get(
      `https://www.googleapis.com/customsearch/v1?q=${encodeURIComponent(query)}&searchType=image&num=1&key=${process.env.GOOGLE_API_KEY}&cx=${process.env.GOOGLE_CX}`
    );

    const data = response.data;
    const imageUrl = data.items?.[0]?.link;

    if (imageUrl) {
      res.json({ success: true, imageUrl });
    } else {
      res.status(404).json({ success: false, error: 'Image not found' });
    }
  } catch (err) {
    console.error('Image fetch error:', err.message);
    res.status(500).json({ success: false, error: 'Image fetch failed' });
  }
});

app.post('/api/fetchMealImage', async (req, res) => {
  const { mealName } = req.body;
  if (!mealName) return res.status(400).json({ success: false, error: 'mealName is required' });
  try {
    const response = await axios.get(
      `https://www.googleapis.com/customsearch/v1?key=${process.env.GOOGLE_API_KEY}&cx=${process.env.GOOGLE_CX}&q=${encodeURIComponent(mealName)}&searchType=image&num=1`
    );
    const data = response.data;
    const imageUrl = data.items?.[0]?.link;
    if (imageUrl) {
      res.json({ success: true, imageUrl });
    } else {
      res.status(404).json({ success: false, error: 'Image not found' });
    }
  } catch (err) {
    console.error('Meal image fetch error:', err.message);
    res.status(500).json({ success: false, error: 'Image fetch failed' });
  }
}); 

