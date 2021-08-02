const WriteBehindTask = require('../models/WriteBehindTask');
const CacheEntry = require('../models/CacheEntry');
const logger = require('../utils/logger');

class WriteBehindService {
  constructor() {
    this.buffer = [];
    this.batchSize = 100;
  }

  /**
   * Buffers an asynchronous write or delete task.
   */
  enqueueTask(cacheKey, operation, payload, assignedNodeId) {
    this.buffer.push({
      taskId: `WB-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      cacheKey,
      operation,
      payload,
      assignedNodeId,
      createdAt: new Date()
    });
  }

  /**
   * Flushes dirty updates in memory to backing persistent store.
   */
  async flush() {
    if (this.buffer.length === 0) return 0;

    const toProcess = this.buffer.splice(0, this.batchSize);
    logger.info(`Write-Behind: Flushing ${toProcess.length} asynchronous persistent entries`);

    for (const task of toProcess) {
      try {
        if (task.operation === 'UPSERT') {
          await CacheEntry.findOneAndUpdate(
            { key: task.cacheKey },
            {
              key: task.cacheKey,
              value: task.payload,
              assignedNodeId: task.assignedNodeId || 'node-us-east-01',
              isDirty: false,
              lastAccessedAt: new Date()
            },
            { upsert: true, new: true }
          );
        } else if (task.operation === 'DELETE') {
          await CacheEntry.deleteOne({ key: task.cacheKey });
        }

        await WriteBehindTask.create({
          taskId: task.taskId,
          cacheKey: task.cacheKey,
          operation: task.operation,
          payload: task.payload,
          status: 'PROCESSED',
          processedAt: new Date()
        });
      } catch (err) {
        logger.error(`Write-Behind error for key '${task.cacheKey}': ${err.message}`);
      }
    }

    return toProcess.length;
  }

  getQueueLength() {
    return this.buffer.length;
  }
}

const writeBehindQueue = new WriteBehindService();

module.exports = {
  WriteBehindService,
  writeBehindQueue
};
