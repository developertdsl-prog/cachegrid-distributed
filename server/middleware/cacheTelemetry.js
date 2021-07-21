const cacheTelemetry = (req, res, next) => {
  const startTime = process.hrtime();
  res.on('finish', () => {
    const [seconds, nanoseconds] = process.hrtime(startTime);
    const durationMs = (seconds * 1000 + nanoseconds / 1e6).toFixed(3);
    res.setHeader('X-Response-Time-Ms', durationMs);
  });
  next();
};

module.exports = cacheTelemetry;
