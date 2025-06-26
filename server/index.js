const express = require('express');
const cors = require('cors');

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

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
}); 