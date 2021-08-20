const express = require('express');
const router = express.Router();
const clusterCtrl = require('../controllers/clusterController');

router.get('/topology', clusterCtrl.getClusterTopology);
router.post('/nodes', clusterCtrl.registerNode);

module.exports = router;
