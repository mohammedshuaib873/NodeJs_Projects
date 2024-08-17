const Policy = require('../models/policy.model');

exports.aggregatePoliciesByUserService = async () => {
    const aggregationResult = await Policy.aggregate([
        {
            $group: {
                _id: '$user',
                totalPolicies: { $sum: 1 },
                policies: { $push: '$$ROOT' }
            }
        },
        {
            $lookup: {
                from: 'users',
                localField: '_id',
                foreignField: '_id',
                as: 'userDetails'
            }
        },
        {
            $unwind: '$userDetails'
        }
    ]);

    return aggregationResult;
};
