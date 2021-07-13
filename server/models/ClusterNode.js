const mongoose = require('mongoose');
const { NODE_STATUS } = require('../config/cacheConstants');

const ClusterNodeSchema = new mongoose.Schema({
  nodeId: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  host: {
    type: String,
    required: true
  },
  port: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: Object.values(NODE_STATUS),
    default: NODE_STATUS.ALIVE
  },
  virtualNodesCount: {
    type: Number,
    default: 128
  },
  keysCount: {
    type: Number,
    default: 0
  },
  memoryUsageBytes: {
    type: Number,
    default: 0
  },
  maxMemoryBytes: {
    type: Number,
    default: 1073741824 // 1 GB default
  },
  lastHeartbeat: {
    type: Date,
    default: Date.now
  },
  joinedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('ClusterNode', ClusterNodeSchema);
