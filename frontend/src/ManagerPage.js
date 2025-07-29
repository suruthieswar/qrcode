import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import './Auth.css';
import './ManagerPage.css';

function ManagerPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchBookings = () => {
    fetch('http://localhost:5000/get-bookings')
      .then(res => res.json())
      .then(data => {
        setBookings(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching bookings:', err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleDelete = async (bookingId) => {
    if (!window.confirm("Are you sure you want to delete this booking?")) return;

    try {
      const response = await fetch(`http://localhost:5000/delete-booking/${bookingId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        alert('Booking deleted ✅');
        fetchBookings();
      } else {
        const data = await response.json();
        alert('Delete failed ❌: ' + data.message);
      }
    } catch (err) {
      console.error('Error deleting booking:', err);
      alert('Server error ❌');
    }
  };

  return (
    <div className="home-wrapper">
      <Navbar />
      <h2 style={{ textAlign: 'center', marginTop: '20px' }}>👋 Welcome, Manager</h2>

      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <button
          onClick={() => navigate(-1)}
          style={{
            backgroundColor: '#3498db',
            color: 'white',
            border: 'none',
            padding: '6px 12px',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          ← Back
        </button>
      </div>

      <div className="booking-summary">
        <h2>📋 All Bookings Overview</h2>

        {loading ? (
          <p>Loading...</p>
        ) : bookings.length === 0 ? (
          <p>No bookings available.</p>
        ) : (
          <ul>
            {bookings.map((booking, idx) => (
              <li key={booking._id || booking.bookingId || idx}>
                <strong>Booking ID:</strong> #{booking.bookingId}<br />
                <strong>Name:</strong> {booking.name}<br />
                <strong>Vehicle No:</strong> {booking.vehicle}<br />
                <strong>Phone:</strong> {booking.phone}<br />
                <strong>Type:</strong> {booking.type}<br />
                <strong>Slot No:</strong> {booking.slot}<br />
                <strong>Time:</strong>{' '}
                {booking.timestamp
                  ? new Date(booking.timestamp).toLocaleString()
                  : 'N/A'}
                <br />

                <button
                  onClick={() => handleDelete(booking.bookingId || booking._id)}
                  style={{
                    marginTop: '10px',
                    backgroundColor: '#e74c3c',
                    color: 'white',
                    border: 'none',
                    padding: '6px 10px',
                    borderRadius: '5px',
                    cursor: 'pointer',
                  }}
                >
                  🗑️ Delete
                </button>

                <hr />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default ManagerPage;
