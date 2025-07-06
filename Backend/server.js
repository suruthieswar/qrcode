const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = 5000;
const JWT_SECRET = 'your_jwt_secret_key';

app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect('mongodb://127.0.0.1:27017/userDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// Mongoose User Schema
const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
});

const User = mongoose.model('User', userSchema);

// Mongoose Booking Schema
const bookingSchema = new mongoose.Schema({
    vehicle: String,
    name: String,
    phone: String,
    type: String,
    slot: Number,
    bookingId: String,
    timestamp: {
        type: Date,
        default: Date.now
    }
});

const Booking = mongoose.model('Booking', bookingSchema);

// Signup API
app.post('/signup', async (req, res) => {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.json({ message: 'User already exists!' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword });
    await user.save();

    res.json({ message: 'User Registered Successfully' });
});

// Login API
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.json({ message: 'User not found' });

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return res.json({ message: 'Invalid Credentials' });

    const token = jwt.sign({ email: user.email }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ message: 'Login Success', token });
});

// Book Slot API
app.post('/book-slot', async (req, res) => {
    const { vehicle, name, phone, type, slot, bookingId } = req.body;

    try {
        const newBooking = new Booking({
            vehicle,
            name,
            phone,
            type,
            slot,
            bookingId,
        });

        await newBooking.save();
        res.json({ message: 'Slot booked successfully' });
    } catch (error) {
        console.error('Booking error:', error);
        res.status(500).json({ message: 'Booking failed' });
    }
});

// Get All Bookings API
app.get('/get-bookings', async (req, res) => {
    try {
        const bookings = await Booking.find();
        res.json(bookings);
    } catch (error) {
        console.error('Fetch bookings error:', error);
        res.status(500).json({ message: 'Failed to fetch bookings' });
    }
});

// ✅ Delete Booking API (using bookingId)
app.delete('/delete-booking/:bookingId', async (req, res) => {
    const { bookingId } = req.params;

    try {
        console.log("Deleting booking with ID:", bookingId);
        
        const deletedBooking = await Booking.findOneAndDelete({ bookingId: bookingId });

        if (!deletedBooking) {
            console.log("Booking not found for ID:", bookingId);
            return res.status(404).json({ message: 'Booking not found' });
        }

        console.log("Deleted booking:", deletedBooking);
        res.json({ message: 'Booking deleted successfully' });
    } catch (error) {
        console.error('Delete booking error:', error);
        res.status(500).json({ message: 'Failed to delete booking' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
