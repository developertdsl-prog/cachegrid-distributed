const express = require('express');
const router = express.Router();
const analyticsCtrl = require('../controllers/analyticsController');

router.get('/summary', analyticsCtrl.getAnalyticsSummary);

module.exports = router;
