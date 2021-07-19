const authApiKey = (req, res, next) => {
  const apiKey = req.headers['x-cache-key'] || req.headers['x-api-key'] || req.query.api_key;
  const expectedKey = process.env.CACHE_API_KEY || 'cachegrid_sec_token_8892';

  if (process.env.NODE_ENV === 'test' || req.path === '/api/v1/ping') {
    return next();
  }

  if (!apiKey || apiKey !== expectedKey) {
    return res.status(401).json({
      success: false,
      error: 'CacheGrid Security Error: Unauthorized access attempt. Invalid x-cache-key header.'
    });
  }

  next();
};

module.exports = authApiKey;
