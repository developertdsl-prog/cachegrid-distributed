const mongoose = require('mongoose');
const ClusterNode = require('../models/ClusterNode');
const CacheEntry = require('../models/CacheEntry');
const { globalRing } = require('../services/consistentHashRing');
const { memoryLRU } = require('../services/lruCacheEngine');
const logger = require('./logger');

const nodesToSeed = [
  { nodeId: 'node-us-east-01', host: '10.0.1.10', port: 5001, status: 'ALIVE', virtualNodesCount: 128 },
  { nodeId: 'node-us-west-01', host: '10.0.2.20', port: 5002, status: 'ALIVE', virtualNodesCount: 128 },
  { nodeId: 'node-eu-central-01', host: '10.0.3.30', port: 5003, status: 'ALIVE', virtualNodesCount: 128 },
  { nodeId: 'node-ap-southeast-01', host: '10.0.4.40', port: 5004, status: 'ALIVE', virtualNodesCount: 128 }
];

async function seed() {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/cachegrid_distributed';
  await mongoose.connect(uri);
  logger.info('Connected to MongoDB for seeding CacheGrid cluster nodes...');

  for (const n of nodesToSeed) {
    await ClusterNode.findOneAndUpdate({ nodeId: n.nodeId }, n, { upsert: true, new: true });
    globalRing.addNode(n.nodeId);
    logger.info(`Seeded Node: ${n.nodeId} (${n.host}:${n.port})`);
  }

  // Seed sample session and product keys
  const sampleKeys = [
    { key: 'session:usr-9901:token', value: { userId: 'usr-9901', role: 'admin' }, ttlSeconds: 7200 },
    { key: 'product:sku-8812:price', value: { sku: 'sku-8812', price: 99.95, currency: 'USD' }, ttlSeconds: 3600 },
    { key: 'config:feature-flags:v2', value: { darkTheme: true, fastRouting: true }, ttlSeconds: 86400 }
  ];

  for (const item of sampleKeys) {
    const assignedNode = globalRing.getNode(item.key);
    await CacheEntry.findOneAndUpdate({ key: item.key }, {
      key: item.key,
      value: item.value,
      ttlSeconds: item.ttlSeconds,
      assignedNodeId: assignedNode,
      isDirty: false
    }, { upsert: true });

    memoryLRU.set(item.key, item.value, item.ttlSeconds);
    logger.info(`Seeded Cache Key: '${item.key}' -> Assigned to '${assignedNode}'`);
  }

  logger.info('CacheGrid seeding completed successfully.');
  await mongoose.disconnect();
}

if (require.main === module) {
  seed().catch(err => {
    logger.error(`Seed error: ${err.message}`);
    process.exit(1);
  });
}

module.exports = seed;
