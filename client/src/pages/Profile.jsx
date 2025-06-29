import React, { useState, useEffect } from "react";
import { useUser } from "../UserContext";
import { FaUserCircle, FaMapMarkerAlt, FaCalendarAlt, FaRupeeSign, FaTrash, FaEye } from "react-icons/fa";
import Footer from "../components/Footer/Footer";
import TripSuggestionCard from "../components/TripSuggestionCard";

const Profile = () => {
  const { user, logout } = useUser();
  const [pastTrips, setPastTrips] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [showTripModal, setShowTripModal] = useState(false);

  // Fetch past trips when user is available
  useEffect(() => {
    if (user?.uid) {
      fetchPastTrips();
    }
  }, [user]);

  const fetchPastTrips = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`http://localhost:3001/api/getPastTrips/${user.uid}`);
      if (response.ok) {
        const data = await response.json();
        setPastTrips(data.trips || []);
      } else {
        setError('Failed to fetch past trips');
      }
    } catch (err) {
      setError('Error connecting to server');
    } finally {
      setLoading(false);
    }
  };

  const deleteTrip = async (tripId) => {
    if (!window.confirm('Are you sure you want to delete this trip?')) return;
    
    try {
      const response = await fetch(`http://localhost:3001/api/deleteTrip/${tripId}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        setPastTrips(pastTrips.filter(trip => trip._id !== tripId));
      } else {
        alert('Failed to delete trip');
      }
    } catch (err) {
      alert('Error deleting trip');
    }
  };

  const viewTripDetails = (trip) => {
    setSelectedTrip(trip);
    setShowTripModal(true);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (!user) return <div style={{textAlign:'center',marginTop:'2rem'}}>Please log in to view your profile.</div>;

  return (
    <>
      <div style={{ 
        maxWidth: 1200, 
        margin: "2rem auto", 
        padding: "0 1rem" 
      }}>
        {/* User Info Section */}
        <div style={{ 
          background: "#fff", 
          borderRadius: 12, 
          padding: 32, 
          boxShadow: "0 2px 8px #0001", 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center',
          marginBottom: '2rem'
        }}>
          <FaUserCircle size={80} color="#6B5B95" style={{ marginBottom: 16 }} />
          <h2 style={{ margin: 0 }}>{user.displayName || 'User'}</h2>
          <p style={{ color: '#555', margin: '8px 0 24px 0' }}>{user.email}</p>
          <button onClick={logout} style={{ 
            background: '#d32f2f', 
            color: '#fff', 
            border: 'none', 
            borderRadius: 7, 
            padding: '0.8rem 2.2rem', 
            fontSize: '1.1rem', 
            fontWeight: 600, 
            cursor: 'pointer' 
          }}>
            Logout
          </button>
        </div>

        {/* Past Trips Section */}
        <div style={{ 
          background: "#fff", 
          borderRadius: 12, 
          padding: 32, 
          boxShadow: "0 2px 8px #0001" 
        }}>
          <h3 style={{ marginBottom: 24, color: '#333' }}>Past Trip Suggestions</h3>
          
          {loading ? (
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              <p>Loading your past trips...</p>
            </div>
          ) : error ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: '#d32f2f' }}>
              <p>{error}</p>
            </div>
          ) : pastTrips.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: '#888' }}>
              <p>No past trips found. Plan your first trip to see it here!</p>
            </div>
          ) : (
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', 
              gap: '1.5rem' 
            }}>
              {pastTrips.map((trip) => (
                <div key={trip._id} style={{
                  border: '1px solid #e0e0e0',
                  borderRadius: '8px',
                  padding: '1.5rem',
                  background: '#fafafa',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  cursor: 'pointer',
                  ':hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                  }
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                    <h4 style={{ margin: 0, color: '#333', fontSize: '1.2rem' }}>
                      <FaMapMarkerAlt style={{ marginRight: '0.5rem', color: '#6B5B95' }} />
                      {trip.city}
                    </h4>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteTrip(trip._id);
                      }}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#d32f2f',
                        cursor: 'pointer',
                        padding: '0.25rem',
                        fontSize: '0.9rem'
                      }}
                      title="Delete trip"
                    >
                      <FaTrash />
                    </button>
                  </div>
                  
                  <div style={{ marginBottom: '1rem', fontSize: '0.9rem', color: '#666' }}>
                    <div style={{ marginBottom: '0.5rem' }}>
                      <FaCalendarAlt style={{ marginRight: '0.5rem' }} />
                      {formatDate(trip.checkIn)} - {formatDate(trip.checkOut)}
                    </div>
                    <div style={{ marginBottom: '0.5rem' }}>
                      <strong>Preference:</strong> {trip.preference}
                    </div>
                    <div>
                      <FaRupeeSign style={{ marginRight: '0.25rem' }} />
                      <strong>Budget:</strong> {trip.budget.toLocaleString()}
                    </div>
                  </div>
                  
                  <div style={{ 
                    fontSize: '0.8rem', 
                    color: '#888', 
                    marginBottom: '1rem',
                    fontStyle: 'italic'
                  }}>
                    Created: {formatDate(trip.createdAt)}
                  </div>
                  
                  <button
                    onClick={() => viewTripDetails(trip)}
                    style={{
                      background: '#6B5B95',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '4px',
                      padding: '0.5rem 1rem',
                      cursor: 'pointer',
                      fontSize: '0.9rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}
                  >
                    <FaEye /> View Details
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Trip Details Modal */}
      {showTripModal && selectedTrip && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.7)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000,
          padding: '1rem'
        }}>
          <div style={{
            background: '#fff',
            borderRadius: '12px',
            padding: '2rem',
            maxWidth: '800px',
            maxHeight: '90vh',
            overflow: 'auto',
            position: 'relative'
          }}>
            <button
              onClick={() => setShowTripModal(false)}
              style={{
                position: 'absolute',
                top: '1rem',
                right: '1rem',
                background: 'none',
                border: 'none',
                fontSize: '1.5rem',
                cursor: 'pointer',
                color: '#666'
              }}
            >
              ×
            </button>
            
            <h2 style={{ marginBottom: '1rem', color: '#333' }}>
              <FaMapMarkerAlt style={{ marginRight: '0.5rem', color: '#6B5B95' }} />
              {selectedTrip.city} Trip Details
            </h2>
            
            <div style={{ marginBottom: '1.5rem', padding: '1rem', background: '#f5f5f5', borderRadius: '8px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                <div>
                  <strong>Check-in:</strong> {formatDate(selectedTrip.checkIn)}
                </div>
                <div>
                  <strong>Check-out:</strong> {formatDate(selectedTrip.checkOut)}
                </div>
                <div>
                  <strong>Preference:</strong> {selectedTrip.preference}
                </div>
                <div>
                  <strong>Budget:</strong> ₹{selectedTrip.budget.toLocaleString()}
                </div>
              </div>
            </div>
            
            <div style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ marginBottom: '1rem', color: '#333' }}>Trip Suggestions</h3>
              <TripSuggestionCard suggestions={selectedTrip.suggestions} />
            </div>
          </div>
        </div>
      )}
      
      <Footer />
    </>
  );
};

export default Profile; 