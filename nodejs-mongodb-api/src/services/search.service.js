const Policy = require('../models/policy.model');
const User = require('../models/user.model');
const LOB = require('../models/lob.model');
const Carrier = require('../models/carrier.model');

exports.searchPolicyByUsernameService = async (username) => {
    const normalizedUsername = username.trim().toLowerCase();

    const user = await User.findOne({ firstname: new RegExp('^' + normalizedUsername + '$', 'i') });

    if (!user) {
        throw new Error('User not found');
    }

    const policies = await Policy.find({ user: user._id })
        .populate('policy_category')
        .populate('company')
        .populate('user');

    return policies;
};
