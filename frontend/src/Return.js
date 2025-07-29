import React, { useState } from 'react';
import Navbar from './Navbar';
import './Auth.css';

function Return() {
  const [slotNumber, setSlotNumber] = useState('');
  const [booking, setBooking] = useState(null);
  const [duration, setDuration] = useState(null);

  const handleSearch = async () => {
    try {
      const res = await fetch('http://localhost:5000/get-bookings');
      const data = await res.json();
      const match = data.find(b => b.slot === parseInt(slotNumber));
      if (match) {
        setBooking(match);
        const startTime = new Date(match.timestamp);
        const now = new Date();
        const diff = Math.floor((now - startTime) / 1000); // in seconds
        const h = Math.floor(diff / 3600);
        const m = Math.floor((diff % 3600) / 60);
        const s = diff % 60;
        setDuration(`${h}h ${m}m ${s}s`);
      } else {
        alert('No active booking found for this slot');
        setBooking(null);
        setDuration(null);
      }
    } catch (err) {
      console.error('Error:', err);
      alert('Error fetching data');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!booking) return;

    try {
      const res = await fetch(`http://localhost:5000/delete-booking/${booking.bookingId}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        alert('Payment Done & Slot Released ✅');
        setBooking(null);
        setSlotNumber('');
        setDuration(null);
      } else {
        alert('Failed to release the slot ❌');
      }
    } catch (error) {
      console.error('Error deleting booking:', error);
      alert('Server Error ❌');
    }
  };

  return (
    <div className="main-content">
      <Navbar />
      <div className="centered-return-form">
        <h2>Return & Payment</h2>
        <label>
          Enter Slot Number to Release:
          <input
            type="number"
            value={slotNumber}
            onChange={(e) => setSlotNumber(e.target.value)}
            placeholder="Enter slot number"
            required
          />
        </label>
        <button onClick={handleSearch}>Check Slot</button>

        {booking && (
          <form onSubmit={handleSubmit}>
            <p><strong>Vehicle:</strong> {booking.vehicle}</p>
            <p><strong>Slot:</strong> {booking.slot}</p>
            <p><strong>Duration:</strong> {duration}</p>
            <button type="submit">Pay & Free Slot</button>
          </form>
        )}
      </div>
    </div>
  );
}

export default Return;
