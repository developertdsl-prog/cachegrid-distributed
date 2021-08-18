const express = require('express');
const router = express.Router();
const cacheCtrl = require('../controllers/cacheController');

router.get('/:key', cacheCtrl.getKey);
router.post('/', cacheCtrl.setKey);
router.delete('/:key', cacheCtrl.deleteKey);

module.exports = router;
