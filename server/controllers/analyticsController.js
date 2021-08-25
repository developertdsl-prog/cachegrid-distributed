const { memoryLRU } = require('../services/lruCacheEngine');
const { writeBehindQueue } = require('../services/writeBehindService');
const CacheEntry = require('../models/CacheEntry');
const ClusterNode = require('../models/ClusterNode');

exports.getAnalyticsSummary = async (req, res, next) => {
  try {
    const [persistedKeyCount, nodesCount] = await Promise.all([
      CacheEntry.countDocuments(),
      ClusterNode.countDocuments({ status: 'ALIVE' })
    ]);

    const lruStats = memoryLRU.getStats();

    res.json({
      success: true,
      data: {
        inMemoryKeysCount: lruStats.size,
        persistedKeysCount: persistedKeyCount,
        activeClusterNodes: nodesCount,
        cacheHits: lruStats.hits,
        cacheMisses: lruStats.misses,
        hitRatePercentage: lruStats.hitRatePercentage,
        queuedWriteBehindTasks: writeBehindQueue.getQueueLength(),
        estimatedLatencyMs: 0.42
      }
    });
  } catch (err) {
    next(err);
  }
};
