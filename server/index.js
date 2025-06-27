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
  const prompt = `You are a smart travel planner.\n\nPlan a 5-day budget-friendly trip to ${city} for a traveler who prefers ${preference} experiences.\nThe stay is from ${checkin} to ${checkout}. The total budget is ₹${budget}.\n\nIf the location is a state (like Goa), pick a popular city or region within it.\nIf the city is not well-known, generate a sample itinerary using general travel knowledge.\n\nInclude:\n\nHotel suggestions (max ₹3,000 total for 4 nights)\n\nMeal suggestions (local food, cafes)\n\nDay-wise itinerary (including local events, activities, and places to visit)\n\nEstimated daily transport cost\n\nEnsure all costs stay within ₹${budget}\n\nReply only in valid JSON format with keys:\n\nhotel\nmeals\nitinerary\nestimatedTotal\nDo not include any code block formatting (such as triple backticks) or any extra explanation. Only output the JSON object as the response.`;

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

