const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Manager = require('../models/Manager');

const router = express.Router();
const JWT_SECRET = 'your_jwt_secret_key';

// Create default manager
const createDefaultManager = async () => {
  const existing = await Manager.findOne({ username: 's' });
  if (!existing) {
    const hashed = await bcrypt.hash('123', 10);
    const manager = new Manager({
      username: 's',
      password: hashed,
      passwordHistory: [{ newPassword: hashed }]
    });
    await manager.save();
    console.log('✅ Default manager created');
  }
};
createDefaultManager();

// Manager login
router.post('/manager-login', async (req, res) => {
  const { username, password } = req.body;
  const manager = await Manager.findOne({ username });
  if (!manager) return res.status(404).json({ message: 'Manager not found' });

  const isMatch = await bcrypt.compare(password, manager.password);
  if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

  const token = jwt.sign({ id: manager._id }, JWT_SECRET, { expiresIn: '1h' });
  res.json({ message: 'Login successful', token });
});

// Reset password (with old password)
router.post('/manager-reset-password', async (req, res) => {
  const { username, oldPassword, newPassword } = req.body;
  const manager = await Manager.findOne({ username });
  if (!manager) return res.status(404).json({ message: 'Manager not found' });

  const isMatch = await bcrypt.compare(oldPassword, manager.password);
  if (!isMatch) return res.status(401).json({ message: 'Old password incorrect' });

  const hashedNew = await bcrypt.hash(newPassword, 10);
  manager.password = hashedNew;
  manager.passwordHistory.push({ newPassword: hashedNew, changedAt: new Date() });

  await manager.save();
  res.json({ message: 'Password updated successfully' });
});

// Forgot password (with secret code)
router.post('/manager-forgot-password', async (req, res) => {
  const { username, secretCode, newPassword } = req.body;

  if (secretCode !== 'admin2025') {
    return res.status(403).json({ message: 'Invalid secret code' });
  }

  const manager = await Manager.findOne({ username });
  if (!manager) return res.status(404).json({ message: 'Manager not found' });

  const hashedNew = await bcrypt.hash(newPassword, 10);
  manager.password = hashedNew;
  manager.passwordHistory.push({ newPassword: hashedNew, changedAt: new Date() });

  await manager.save();
  res.json({ message: 'Password reset via secret code' });
});

// Optional: Get password change history (admin use only)
router.get('/manager-password-history/:username', async (req, res) => {
  const { username } = req.params;
  const manager = await Manager.findOne({ username });

  if (!manager) {
    return res.status(404).json({ message: 'Manager not found' });
  }

  res.json(manager.passwordHistory);
});

module.exports = router;
