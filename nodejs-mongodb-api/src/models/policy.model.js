const mongoose = require('mongoose');

const policySchema = new mongoose.Schema({
    policy_number: { type: String },
    policy_start_date: { type: Date },
    policy_end_date: { type: Date },
    policy_category: { type: mongoose.Schema.Types.ObjectId, ref: 'LOB' },
    company: { type: mongoose.Schema.Types.ObjectId, ref: 'Carrier' },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
});

module.exports = mongoose.model('Policy', policySchema);
