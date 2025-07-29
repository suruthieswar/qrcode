import React, { useEffect, useState } from 'react';
import Navbar from './Navbar';
import './Auth.css';

function SummaryPage() {
  const [bookedSlots, setBookedSlots] = useState([]);
  const totalSlots = 50;

  useEffect(() => {
    fetch('http://localhost:5000/get-bookings')
      .then(res => res.json())
      .then(data => setBookedSlots(data))
      .catch(err => console.error('Error fetching bookings:', err));
  }, []);

  return (
    <div className="home-wrapper">
      <Navbar />
      <div className="parking-layout">
        <div className="slots-grid">
          {Array.from({ length: totalSlots }, (_, i) => {
            const slotNumber = i + 1;
            const slotData = bookedSlots.find(slot => slot.slot === slotNumber);
            const isBooked = !!slotData;

            return (
              <div
                key={slotNumber}
                className={`slot ${isBooked ? 'occupied' : 'available'}`}
                title={isBooked ? `Slot ${slotNumber} - Booked` : `Slot ${slotNumber} - Available`}
              >
                {slotNumber}
                {isBooked && <div className="slot-id">#{slotData.bookingId}</div>}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default SummaryPage;
