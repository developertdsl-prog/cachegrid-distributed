const ClusterNode = require('../models/ClusterNode');
const { NODE_STATUS } = require('../config/cacheConstants');
const { globalRing } = require('./consistentHashRing');
const logger = require('../utils/logger');

class GossipClusterService {
  /**
   * Periodic heartbeat ping verifying alive nodes and pruning dead ones.
   */
  static async checkClusterHealth(heartbeatThresholdMs = 30000) {
    const now = Date.now();
    const nodes = await ClusterNode.find();

    for (const node of nodes) {
      const timeSinceLastHeartbeat = now - new Date(node.lastHeartbeat).getTime();
      if (timeSinceLastHeartbeat > heartbeatThresholdMs && node.status === NODE_STATUS.ALIVE) {
        logger.warn(`Cluster Node '${node.nodeId}' missed heartbeats. Transitioning to DEAD.`);
        node.status = NODE_STATUS.DEAD;
        await node.save();
        globalRing.removeNode(node.nodeId);
      }
    }
  }

  /**
   * Sends heartbeat ping from current node.
   */
  static async pingHeartbeat(nodeId, keysCount = 0, memoryBytes = 0) {
    return await ClusterNode.findOneAndUpdate(
      { nodeId },
      {
        nodeId,
        status: NODE_STATUS.ALIVE,
        keysCount,
        memoryUsageBytes: memoryBytes,
        lastHeartbeat: new Date()
      },
      { upsert: true, new: true }
    );
  }
}

module.exports = GossipClusterService;
