const express = require('express');
const cors = require('cors');
// Use node-fetch v2 for CommonJS compatibility
// Make sure to run: npm install node-fetch@2
const fetch = require('node-fetch');
require('dotenv').config();

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

app.get('/api/test', (req, res) => {
  res.json({ message: 'Hello from the backend!' });
});

app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  console.log('Login attempt:', { email });
  // In a real app, you'd validate credentials here
  res.json({ success: true, message: 'Login successful (dummy)' });
});

app.post('/api/signup', (req, res) => {
  const { email, password } = req.body;
  console.log('Signup attempt:', { email });
  // In a real app, you'd create a new user here
  res.json({ success: true, message: 'Signup successful (dummy)' });
});
app.get('/api/test', (req, res) => {
  res.json({ message: 'Test route working!' });
});
console.log('Loaded OpenRouter API Key:', process.env.OPENROUTER_API_KEY ? 'YES' : 'NO');
console.log('Using OpenRouter API Key:', process.env.OPENROUTER_API_KEY?.slice(0, 8));
app.post('/api/deepseek-trip', async (req, res) => {
  const { city, checkin, checkout, preference, budget } = req.body;
  const prompt = `You are a smart travel planner.\n\nPlan a 5-day budget-friendly trip to ${city} for a traveler who prefers ${preference} experiences.\nThe stay is from ${checkin} to ${checkout}. The total budget is ₹${budget}.\n\nIf the location is a state (like Goa), pick a popular city or region within it.\nIf the city is not well-known, generate a sample itinerary using general travel knowledge.\n\nInclude:\n\nHotel suggestions (max ₹8,000 total for 4 nights). For the recommended hotel, provide a 'features' array with at least 3 features (e.g., free WiFi, breakfast included, central location, etc.).\n\nMeal suggestions (not day-wise): For each meal type (breakfast, lunch, dinner), reply as an object with keys: cuisineType, famousDish, minCost (in INR), and a 'recommendedRestaurants' array with at least 3 famous restaurant names for that meal.\n\nDay-wise itinerary: Use the check-in date as Day 1, and increment each day up to the check-out date, labeling each day with the actual date (e.g., 'Monday, 2024-06-10'). For each place/activity in the itinerary, include a 'minTransportCost' field (in INR) indicating the minimum local transport cost to reach that place.\n\nEstimated daily transport cost.\n\nA packing list (as an array of items) based on the weather forecast for the trip (e.g., if winter: warm clothes, if rainy: umbrella, if sunny: sunscreen, etc.).\n\nEnsure all costs stay within ₹${budget}.\n\nReply only in valid JSON format with keys:\n\nhotel (with features array)\nmeals (with cuisineType, famousDish, minCost, and recommendedRestaurants for each meal type)\nitinerary (with each day labeled by actual date, and each place/activity including minTransportCost)\nestimatedTotal\npackingList (array of items based on weather)\n\nExample JSON:\n{\n  \"hotel\": {\n    \"name\": \"Hotel Name\",\n    \"type\": \"Budget Hotel\",\n    \"totalCost\": 5000,\n    \"features\": [\"Free WiFi\", \"Breakfast included\", \"Central location\"]\n  },\n  \"meals\": {\n    \"breakfast\": {\n      \"cuisineType\": \"Continental\",\n      \"famousDish\": \"Pancakes\",\n      \"minCost\": 150,\n      \"recommendedRestaurants\": [\"Cafe XYZ\", \"Morning Glory\", \"Sunrise Diner\"]\n    },\n    \"lunch\": {\n      \"cuisineType\": \"Indian\",\n      \"famousDish\": \"Thali\",\n      \"minCost\": 250,\n      \"recommendedRestaurants\": [\"ABC Restaurant\", \"Spice Hub\", \"Curry House\"]\n    },\n    \"dinner\": {\n      \"cuisineType\": \"Italian\",\n      \"famousDish\": \"Pizza\",\n      \"minCost\": 300,\n      \"recommendedRestaurants\": [\"Pizzeria 123\", \"La Dolce Vita\", \"Roma Kitchen\"]\n    }\n  },\n  \"itinerary\": {\n    \"Monday, 2024-06-10\": {\n      \"Morning\": {\"place\": \"Beach\", \"minTransportCost\": 100},\n      \"Afternoon\": {\"place\": \"Museum\", \"minTransportCost\": 80}\n    }\n  },\n  \"estimatedTotal\": {\"breakdown\": {\"hotel\": 5000, \"meals\": 2100}, \"total\": 8000},\n  \"packingList\": [\"Warm clothes\", \"Umbrella\", \"Sunscreen\"]\n}\n\nDo not include any code block formatting (such as triple backticks) or any extra explanation. Only output the JSON object as the response.`;

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'deepseek/deepseek-chat-v3-0324:free',
        messages: [
          { role: 'user', content: prompt }
        ]
      })
    });
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch trip suggestions from OpenRouter' });
  }
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
}); 

