const searchService = require('../services/search.service');

exports.searchPolicyByUsername = async (req, res) => {
    try {
        const policies = await searchService.searchPolicyByUsernameService(req.params.username);
        res.status(200).json(policies);
    } catch (error) {
        res.status(500).json({ message: 'Error searching policies', error: error.message });
    }
};
