const express = require('express');
const router = express.Router();
const wbCtrl = require('../controllers/writeBehindController');

router.get('/status', wbCtrl.getQueueStatus);
router.post('/flush', wbCtrl.flushQueue);

module.exports = router;
