const logger = require('../utils/logger');

const errorHandler = (err, req, res, next) => {
  logger.error(`CacheGrid Exception [${req.method} ${req.url}]: ${err.message}`, { stack: err.stack });

  const statusCode = err.statusCode || (res.statusCode === 200 ? 500 : res.statusCode);
  res.status(statusCode).json({
    success: false,
    error: err.message || 'Internal CacheGrid Node Fault',
    code: err.code || 'ERR_CACHEGRID_NODE_FAULT',
    timestamp: new Date().toISOString()
  });
};

module.exports = errorHandler;
