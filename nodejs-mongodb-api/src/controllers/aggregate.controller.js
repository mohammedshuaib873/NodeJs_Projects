const aggregateService = require('../services/aggregate.service');

exports.aggregatePoliciesByUser = async (req, res) => {
    try {
        const aggregationResult = await aggregateService.aggregatePoliciesByUserService();
        res.status(200).json(aggregationResult);
    } catch (error) {
        res.status(500).json({ message: 'Error aggregating policies', error: error.message });
    }
};
