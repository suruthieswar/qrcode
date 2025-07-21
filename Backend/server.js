const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const BookingHistory = require('./models/BookingHistory');
const Manager = require('./models/Manager');

const app = express();
const PORT = 5000;
const JWT_SECRET = 'your_jwt_secret_key';

app.use(cors());
app.use(express.json());

// 🔗 MongoDB Connection
mongoose.connect('mongodb://127.0.0.1:27017/userDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log("✅ MongoDB Connected"))
.catch(err => console.error("❌ MongoDB Error:", err));

// ======================= 🔁 MODELS =======================
const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
});

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

const User = mongoose.model('User', userSchema);
const Booking = mongoose.model('Booking', bookingSchema);

// ======================= 🔐 USER AUTH =======================
app.post('/signup', async (req, res) => {
    const { name, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.json({ message: 'User already exists!' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword });
    await user.save();

    res.json({ message: 'User Registered Successfully' });
});

app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.json({ message: 'User not found' });

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return res.json({ message: 'Invalid Credentials' });

    const token = jwt.sign({ email: user.email }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ message: 'Login Success', token });
});

// ======================= 🔐 MANAGER ROUTES =======================

// 🔄 Create Default Manager (can also call manually if needed)
const createDefaultManager = async () => {
    const existing = await Manager.findOne({ username: 's' });
    if (!existing) {
        const hashed = await bcrypt.hash('123', 10);
        const manager = new Manager({ username: 's', password: hashed });
        await manager.save();
        console.log('✅ Default manager created');
    }
};
createDefaultManager();

// 🧑 Manager Login
app.post('/manager-login', async (req, res) => {
    const { username, password } = req.body;
    const manager = await Manager.findOne({ username });
    if (!manager) return res.status(404).json({ message: 'Manager not found' });

    const isMatch = await bcrypt.compare(password, manager.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    res.json({ message: 'Login successful' });
});

// 🔁 Reset Password
app.post('/manager-reset-password', async (req, res) => {
    const { username, oldPassword, newPassword } = req.body;
    const manager = await Manager.findOne({ username });
    if (!manager) return res.status(404).json({ message: 'Manager not found' });

    const isMatch = await bcrypt.compare(oldPassword, manager.password);
    if (!isMatch) return res.status(401).json({ message: 'Old password incorrect' });

    const hashedNew = await bcrypt.hash(newPassword, 10);
    manager.password = hashedNew;

    // ✅ Add to password history
    manager.passwordHistory.push({
        changedAt: new Date(),
        newPassword: newPassword // For production, hash or mask this
    });

    await manager.save();

    res.json({ message: 'Password updated successfully' });
});

// 🔐 Forgot Password with Secret Code
app.post('/manager-forgot-password', async (req, res) => {
    const { username, secretCode, newPassword } = req.body;
    if (secretCode !== 'admin2025') {
        return res.status(403).json({ message: 'Invalid secret code' });
    }

    const manager = await Manager.findOne({ username });
    if (!manager) return res.status(404).json({ message: 'Manager not found' });

    const hashedNew = await bcrypt.hash(newPassword, 10);
    manager.password = hashedNew;

    // ✅ Add to password history
    manager.passwordHistory.push({
        changedAt: new Date(),
        newPassword: newPassword
    });

    await manager.save();

    res.json({ message: 'Password reset via secret code' });
});

// View Manager Password History (Optional)
app.get('/manager-password-history/:username', async (req, res) => {
    const manager = await Manager.findOne({ username: req.params.username });
    if (!manager) return res.status(404).json({ message: 'Manager not found' });

    res.json(manager.passwordHistory);
});

// ======================= 📌 BOOKING ROUTES =======================
app.post('/book-slot', async (req, res) => {
    const { vehicle, name, phone, type, slot, bookingId } = req.body;
    try {
        const newBooking = new Booking({
            vehicle, name, phone, type, slot, bookingId,
        });
        await newBooking.save();

        const historyBooking = new BookingHistory(newBooking.toObject());
        await historyBooking.save();

        res.json({ message: 'Slot booked successfully' });
    } catch (error) {
        console.error('Booking error:', error);
        res.status(500).json({ message: 'Booking failed' });
    }
});

app.get('/get-bookings', async (req, res) => {
    try {
        const bookings = await Booking.find();
        res.json(bookings);
    } catch (error) {
        console.error('Fetch bookings error:', error);
        res.status(500).json({ message: 'Failed to fetch bookings' });
    }
});

app.delete('/delete-booking/:bookingId', async (req, res) => {
    const { bookingId } = req.params;
    try {
        const deletedBooking = await Booking.findOneAndDelete({ bookingId });
        if (!deletedBooking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        await BookingHistory.findOneAndUpdate(
            { bookingId },
            { deletedByManager: true, deletedAt: new Date() }
        );

        res.json({ message: 'Booking deleted successfully' });
    } catch (error) {
        console.error('Delete booking error:', error);
        res.status(500).json({ message: 'Failed to delete booking' });
    }
});

app.get('/get-booking-history', async (req, res) => {
    try {
        const history = await BookingHistory.find().sort({ timestamp: -1 });
        res.json(history);
    } catch (error) {
        console.error('Fetch booking history error:', error);
        res.status(500).json({ message: 'Failed to fetch history' });
    }
});

// ======================= 🚀 SERVER =======================
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
