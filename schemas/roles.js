const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    description: { type: String, default: "" },
    timestamp: { type: Date, default: Date.now },
    isDeleted: { type: Boolean, default: false }
});

module.exports = mongoose.model('Role', roleSchema);
