import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import './Auth.css';

function BookingPage() {
  const [bookingDetails, setBookingDetails] = useState(null);
  const [bookedSlots, setBookedSlots] = useState([]);
  const totalSlots = 50;

  useEffect(() => {
    fetch('http://localhost:5000/get-bookings')
      .then(res => res.json())
      .then(data => setBookedSlots(data))
      .catch(err => console.error('Error fetching bookings:', err));
  }, []);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const form = new FormData(e.target);
    const details = {
      vehicle: form.get('vehicleNumber'),
      name: form.get('ownerName'),
      phone: form.get('phone'),
      type: form.get('vehicleType'),
    };
    setBookingDetails(details);
  };

  const handleSlotClick = async (slotNumber) => {
    if (bookedSlots.some(slot => slot.slot === slotNumber)) return;

    const bookingId = Date.now().toString().slice(-6);
    const newBooking = {
      ...bookingDetails,
      slot: slotNumber,
      bookingId,
    };

    try {
      const response = await fetch('http://localhost:5000/book-slot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newBooking),
      });

      const data = await response.json();

      if (response.ok) {
        alert('Booking Successful ✅');
        setBookedSlots([...bookedSlots, newBooking]);
        setBookingDetails(null);
      } else {
        alert('Booking Failed ❌: ' + data.message);
      }
    } catch (error) {
      console.error('Error booking slot:', error);
      alert('Server Error ❌');
    }
  };

  return (
    <div className="main-content">
      <Navbar />
      {!bookingDetails && (
        <form className="booking-form" onSubmit={handleFormSubmit}>
          <h2>Book Your Spot</h2>
          <label>Vehicle Number: <input type="text" name="vehicleNumber" required /></label>
          <label>Owner Name: <input type="text" name="ownerName" required /></label>
          <label>Phone Number: <input type="tel" name="phone" required /></label>
          <label>Vehicle Type:
            <select name="vehicleType" required>
              <option value="">Select Type</option>
              <option value="Car">Car</option>
              <option value="Bike">Bike</option>
              <option value="Truck">Truck</option>
            </select>
          </label>
          <button type="submit">Proceed to Choose Slot</button>
        </form>
      )}

      {bookingDetails && (
        <div className="parking-layout">
          <h2>Select Your Slot</h2>
          <div className="slots-grid">
            {Array.from({ length: totalSlots }, (_, i) => {
              const slotNumber = i + 1;
              const current = bookedSlots.find(slot => slot.slot === slotNumber);
              const isBooked = !!current;

              return (
                <div
                  key={slotNumber}
                  className={`slot ${isBooked ? 'occupied' : 'available'}`}
                  onClick={() => !isBooked && handleSlotClick(slotNumber)}
                  title={isBooked ? `Booked by ${current.name}` : 'Click to book'}
                >
                  {slotNumber}
                  {isBooked && <div className="slot-id">#{current.bookingId}</div>}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default BookingPage;
