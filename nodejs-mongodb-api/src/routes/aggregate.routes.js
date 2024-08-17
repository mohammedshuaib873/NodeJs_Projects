const express = require('express');
const router = express.Router();
const aggregateController = require('../controllers/aggregate.controller');

router.get('/aggregate', aggregateController.aggregatePoliciesByUser);

module.exports = router;
