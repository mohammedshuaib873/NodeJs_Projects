const mongoose = require('mongoose');

const accountSchema = new mongoose.Schema({
    account_name: { type: String },
});

module.exports = mongoose.model('Account', accountSchema);
