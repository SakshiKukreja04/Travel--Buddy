import React from "react";
import { useUser } from "../UserContext";
import { FaUserCircle } from "react-icons/fa";

const Profile = () => {
  const { user, logout } = useUser();

  if (!user) return <div style={{textAlign:'center',marginTop:'2rem'}}>Please log in to view your profile.</div>;

  return (
    <div style={{ maxWidth: 420, margin: "2rem auto", background: "#fff", borderRadius: 12, padding: 32, boxShadow: "0 2px 8px #0001", display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <FaUserCircle size={80} color="#6B5B95" style={{ marginBottom: 16 }} />
      <h2 style={{ margin: 0 }}>{user.displayName || 'User'}</h2>
      <p style={{ color: '#555', margin: '8px 0 24px 0' }}>{user.email}</p>
      <div style={{ width: '100%', marginBottom: 32 }}>
        <h3 style={{ marginBottom: 12 }}>Past Trip Suggestions</h3>
        <div style={{ color: '#888', fontStyle: 'italic', textAlign: 'center' }}>
          (Your past trip suggestions will appear here.)
        </div>
      </div>
      <button onClick={logout} style={{ marginTop: 24, background: '#d32f2f', color: '#fff', border: 'none', borderRadius: 7, padding: '0.8rem 2.2rem', fontSize: '1.1rem', fontWeight: 600, cursor: 'pointer' }}>
        Logout
      </button>
    </div>
  );
};

export default Profile; 