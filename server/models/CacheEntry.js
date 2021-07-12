const mongoose = require('mongoose');

const CacheEntrySchema = new mongoose.Schema({
  key: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    index: true
  },
  value: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  valueType: {
    type: String,
    default: 'JSON'
  },
  ttlSeconds: {
    type: Number,
    default: 3600
  },
  expiresAt: {
    type: Date,
    index: true
  },
  accessCount: {
    type: Number,
    default: 0
  },
  lastAccessedAt: {
    type: Date,
    default: Date.now
  },
  assignedNodeId: {
    type: String,
    required: true
  },
  isDirty: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

CacheEntrySchema.index({ assignedNodeId: 1, lastAccessedAt: -1 });

module.exports = mongoose.model('CacheEntry', CacheEntrySchema);
