const mongoose = require('mongoose');

const WriteBehindTaskSchema = new mongoose.Schema({
  taskId: {
    type: String,
    required: true,
    unique: true
  },
  cacheKey: {
    type: String,
    required: true,
    index: true
  },
  operation: {
    type: String,
    enum: ['UPSERT', 'DELETE'],
    default: 'UPSERT'
  },
  payload: {
    type: mongoose.Schema.Types.Mixed
  },
  status: {
    type: String,
    enum: ['PENDING', 'PROCESSED', 'FAILED'],
    default: 'PENDING'
  },
  retries: {
    type: Number,
    default: 0
  },
  processedAt: {
    type: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

WriteBehindTaskSchema.index({ status: 1, createdAt: 1 });

module.exports = mongoose.model('WriteBehindTask', WriteBehindTaskSchema);
