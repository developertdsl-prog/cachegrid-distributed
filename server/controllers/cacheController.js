const { memoryLRU } = require('../services/lruCacheEngine');
const { globalRing } = require('../services/consistentHashRing');
const { stampedeGuard } = require('../services/cacheStampedeGuard');
const { writeBehindQueue } = require('../services/writeBehindService');
const CacheEntry = require('../models/CacheEntry');

exports.getKey = async (req, res, next) => {
  try {
    const { key } = req.params;
    const targetNode = globalRing.getNode(key) || 'node-us-east-01';

    // 1. Check in-memory L1 LRU cache
    const cachedVal = memoryLRU.get(key);
    if (cachedVal !== null) {
      res.setHeader('X-Cache-Lookup', 'HIT-L1-MEMORY');
      res.setHeader('X-Cache-Node', targetNode);
      return res.json({ success: true, key, value: cachedVal, source: 'L1_MEMORY' });
    }

    // 2. Cache Miss -> Stampede Guard around Backing Store lookup
    const dbValue = await stampedeGuard.execute(key, async () => {
      const entry = await CacheEntry.findOne({ key });
      return entry ? entry.value : null;
    });

    if (dbValue !== null) {
      // Repopulate L1 Cache
      memoryLRU.set(key, dbValue, 3600);
      res.setHeader('X-Cache-Lookup', 'HIT-L2-STORE');
      res.setHeader('X-Cache-Node', targetNode);
      return res.json({ success: true, key, value: dbValue, source: 'L2_STORE' });
    }

    res.setHeader('X-Cache-Lookup', 'MISS');
    return res.status(404).json({ success: false, error: `Key '${key}' not found in cache grid` });
  } catch (err) {
    next(err);
  }
};

exports.setKey = async (req, res, next) => {
  try {
    const { key, value, ttlSeconds, writePolicy } = req.body;
    if (!key || value === undefined) {
      return res.status(400).json({ success: false, error: 'Key and value are required' });
    }

    const ttl = ttlSeconds || 3600;
    const targetNode = globalRing.getNode(key) || 'node-us-east-01';

    // 1. Write to in-memory L1 cache
    memoryLRU.set(key, value, ttl);

    // 2. Handle persistence policy
    if (writePolicy === 'WRITE_THROUGH') {
      await CacheEntry.findOneAndUpdate(
        { key },
        { key, value, ttlSeconds: ttl, assignedNodeId: targetNode, isDirty: false, lastAccessedAt: new Date() },
        { upsert: true, new: true }
      );
    } else {
      // Default: WRITE_BEHIND
      writeBehindQueue.enqueueTask(key, 'UPSERT', value, targetNode);
    }

    res.setHeader('X-Cache-Node', targetNode);
    res.status(201).json({
      success: true,
      message: 'Key cached successfully',
      key,
      assignedNode: targetNode,
      writePolicy: writePolicy || 'WRITE_BEHIND'
    });
  } catch (err) {
    next(err);
  }
};

exports.deleteKey = async (req, res, next) => {
  try {
    const { key } = req.params;
    memoryLRU.delete(key);
    writeBehindQueue.enqueueTask(key, 'DELETE', null);

    res.json({ success: true, message: `Key '${key}' invalidated across cache grid` });
  } catch (err) {
    next(err);
  }
};
