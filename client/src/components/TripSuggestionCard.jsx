import React from "react";

const TripSuggestionCard = ({ suggestions }) => {
  if (!suggestions) return null;

  return (
    <div>
      {/* Hotel Section */}
      {suggestions.hotel && (
        <section style={{ marginBottom: '1.2rem' }}>
          <h4 style={{ marginBottom: 4 }}>Hotel</h4>
          <p><b>{suggestions.hotel.name}</b> ({suggestions.hotel.type})</p>
          <p><b>Cost:</b> ₹{suggestions.hotel.totalCost}</p>
          <ul>
            {suggestions.hotel.features?.map((f, i) => <li key={i}>{f}</li>)}
          </ul>
        </section>
      )}

      {/* Meals Section */}
      {suggestions.meals && (
        <section style={{ marginBottom: '1.2rem' }}>
          <h4 style={{ marginBottom: 4 }}>Meals</h4>
          {Object.entries(suggestions.meals).map(([meal, info]) => (
            <div key={meal} style={{ marginBottom: 8 }}>
              <b>{meal.charAt(0).toUpperCase() + meal.slice(1)}:</b>
              <div>Cuisine: {info.cuisineType}</div>
              <div>Famous Dish: {info.famousDish}</div>
              <div>Min Cost: ₹{info.minCost}</div>
              <div>Restaurants: {info.recommendedRestaurants?.join(", ")}</div>
            </div>
          ))}
        </section>
      )}

      {/* Itinerary Section */}
      {suggestions.itinerary && (
        <section style={{ marginBottom: '1.2rem' }}>
          <h4 style={{ marginBottom: 4 }}>Itinerary</h4>
          {Object.entries(suggestions.itinerary).map(([day, details]) => (
            <div key={day} style={{ marginBottom: 6 }}>
              <b>{day}</b>
              <ul style={{ marginLeft: 16 }}>
                {Object.entries(details).map(([k, v]) => (
                  <li key={k}>
                    <b>{k}:</b> {typeof v === "object" && v.place ? v.place : v}
                    {v.minTransportCost && <> (Min Transport: ₹{v.minTransportCost})</>}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </section>
      )}

      {/* Estimated Total */}
      {suggestions.estimatedTotal && (
        <section style={{ marginBottom: '1.2rem' }}>
          <h4 style={{ marginBottom: 4 }}>Estimated Budget</h4>
          <ul>
            {Object.entries(suggestions.estimatedTotal.breakdown || {}).map(([k, v]) => (
              <li key={k}><b>{k}:</b> {v}</li>
            ))}
          </ul>
          <p><b>Total:</b> {suggestions.estimatedTotal.total}</p>
        </section>
      )}

      {/* Packing List */}
      {Array.isArray(suggestions.packingList) && suggestions.packingList.length > 0 && (
        <section style={{ marginBottom: '1.2rem' }}>
          <h4 style={{ marginBottom: 4 }}>Packing List</h4>
          <ul>
            {suggestions.packingList.map((item, idx) => <li key={idx}>{item}</li>)}
          </ul>
        </section>
      )}
    </div>
  );
};

export default TripSuggestionCard; 