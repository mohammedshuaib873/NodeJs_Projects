const express = require('express');
const router = express.Router();
const searchController = require('../controllers/search.controller');

router.get('/search/:username', searchController.searchPolicyByUsername);

module.exports = router;
