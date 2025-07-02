# 🌍 Project Overview  
**TravelPlanner Pro**  
A full-stack travel planning application that generates personalized trip itineraries using AI and real-time event data.  

**Key Features**:  
- AI-powered trip suggestions (via Deepseek API)  
- Event discovery with PredictHQ integration  
- User authentication with Firebase  
- Interactive trip planning interface  
- Saved trip history with database persistence  

**Tech Stack**:  
- Frontend: React, CSS Modules  
- Backend: Node.js, Express, Mongoose  
- APIs: Firebase Auth, PredictHQ, Deepseek, Meal Image API  
- Database: MongoDB  

---

# 🛠️ Architecture  
**Structure**:  
```
repo_path/  
├── client/ (React frontend)  
│   ├── components/ (reusable UI elements)  
│   ├── pages/ (page-specific components)  
│   └── utils/ (API helper functions)  
└── server/ (Node.js backend)  
    ├── routes/ (API endpoints)  
    └── models/ (MongoDB schemas)  
```  

**Interaction Flow**:  
1. User interacts with frontend components (e.g., Hero, CTA)  
2. Authentication via `firebase.js` handles user sessions  
3. Trip generation triggers `/api/deepseek-trip` endpoint  
4. Event data fetched via `/api/predicthq-events`  
5. Styles managed through component-specific CSS Modules  

---

# 🔧 Technical Details  

### Core Components  
- **Trip Planner**:  
  - `getTripSuggestions()` (AI-driven itinerary generation)  
  - `/api/deepseek-trip` endpoint for backend processing  

- **Event Integration**:  
  - `fetchPredictHQEvents()` for real-time event data  
  - `getEventCategoryIcon()` for visual event categorization  

### Supporting Modules  
- **API Utilities**:  
  - `tripPlannerAPI.js` (core trip logic)  
  - `mealImageAPI.js` (meal image fetching)  
  - `predicthqAPI.js` (event data handling)  

### Configuration  
- Firebase setup in `client/src/firebase.js`  
- MongoDB connection in `server/index.js`  

### Additional Features  
- Hotel/meal image APIs (`/api/fetchHotelImage`, `/api/fetchMealImage`)  
- Responsive UI with CSS Modules for component styling  

---

# 🌐 API Reference  

### Server Endpoints  

| Method | Endpoint                          | Purpose                                  |  
|--------|-----------------------------------|------------------------------------------|  
| `POST` | `/api/deepseek-trip`              | Generates trip suggestions via AI model  |  
| `POST` | `/api/predicthq-events`           | Fetches events for location/date range   |  
| `POST` | `/api/saveTrip`                   | Saves trip to MongoDB                    |  
| `GET`  | `/api/getPastTrips/:userId`       | Retrieves user's past trips              |  
| `DELETE`| `/api/deleteTrip/:tripId`        | Removes a saved trip                     |  

**Example Request (Trip Generation)**:  
```bash
POST /api/deepseek-trip  
Body: { destination: "Paris", duration: 7 }
```  

---

# 🚀 Setup & Usage  

### Installation  
1. Clone repository: `git clone <repo-url>`  
2. Install dependencies:  
   ```bash  
   cd client && npm install  
   cd ../server && npm install  
   ```  
3. Configure Firebase in `client/src/firebase.js`  
4. Set environment variables for API keys  

### Run Locally  
```bash  
# Start client: 
npm run start --prefix client  

# Start server: 
npm run dev --prefix server  
```  

### Basic Workflow  
1. User signs up/login via auth pages  
2. Input trip parameters on planning page  
3. Click "Generate Trip" to trigger AI endpoint  
4. View suggestions with event/meal/hotel data  
5. Save trips to persistent storage  

