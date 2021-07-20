const requestCounts = new Map();

const rateLimiter = (req, res, next) => {
  const ip = req.ip || '127.0.0.1';
  const now = Date.now();
  const windowMs = 60 * 1000;
  const maxRequests = 2000;

  const client = requestCounts.get(ip) || { count: 0, resetTime: now + windowMs };
  if (now > client.resetTime) {
    client.count = 1;
    client.resetTime = now + windowMs;
  } else {
    client.count++;
  }

  requestCounts.set(ip, client);

  if (client.count > maxRequests) {
    return res.status(429).json({
      success: false,
      error: 'CacheGrid Rate limit exceeded: Request throttled.'
    });
  }

  next();
};

module.exports = rateLimiter;
