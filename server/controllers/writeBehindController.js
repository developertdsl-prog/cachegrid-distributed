const { writeBehindQueue } = require('../services/writeBehindService');

exports.getQueueStatus = (req, res) => {
  res.json({
    success: true,
    data: {
      queuedTasksCount: writeBehindQueue.getQueueLength(),
      status: 'IDLE_HEALTHY'
    }
  });
};

exports.flushQueue = async (req, res, next) => {
  try {
    const flushedCount = await writeBehindQueue.flush();
    res.json({ success: true, message: `Flushed ${flushedCount} write-behind tasks to persistent database` });
  } catch (err) {
    next(err);
  }
};
