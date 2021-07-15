const mongoose = require('mongoose');

const CacheInvalidationEventSchema = new mongoose.Schema({
  eventId: {
    type: String,
    required: true,
    unique: true
  },
  pattern: {
    type: String,
    required: true
  },
  affectedKeysCount: {
    type: Number,
    default: 0
  },
  triggeredBy: {
    type: String,
    default: 'API_INVOCATION'
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('CacheInvalidationEvent', CacheInvalidationEventSchema);
