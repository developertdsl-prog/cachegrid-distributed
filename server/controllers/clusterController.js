const ClusterNode = require('../models/ClusterNode');
const { globalRing } = require('../services/consistentHashRing');

exports.getClusterTopology = async (req, res, next) => {
  try {
    const nodes = await ClusterNode.find().sort({ joinedAt: 1 });
    const ringTopology = globalRing.getTopology();

    res.json({
      success: true,
      data: {
        ring: ringTopology,
        nodes
      }
    });
  } catch (err) {
    next(err);
  }
};

exports.registerNode = async (req, res, next) => {
  try {
    const { nodeId, host, port, virtualNodesCount } = req.body;
    const node = await ClusterNode.findOneAndUpdate(
      { nodeId },
      { nodeId, host: host || 'localhost', port: port || 5000, virtualNodesCount: virtualNodesCount || 128 },
      { upsert: true, new: true }
    );

    globalRing.addNode(nodeId);
    res.status(201).json({ success: true, data: node });
  } catch (err) {
    next(err);
  }
};
