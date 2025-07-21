// models/Manager.js
const mongoose = require('mongoose');

const managerSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  passwordHistory: [
    {
      changedAt: { type: Date, default: Date.now },
      newPassword: { type: String }
    }
  ]
});

module.exports = mongoose.model('Manager', managerSchema);
