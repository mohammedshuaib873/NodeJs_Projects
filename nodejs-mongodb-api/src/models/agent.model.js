const mongoose = require('mongoose');

const AgentSchema = new mongoose.Schema({
    agent: String
});


module.exports = mongoose.model('Agent', AgentSchema);
