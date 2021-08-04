const logger = require('../utils/logger');

/**
 * Singleflight Lock Engine
 * Coalesces duplicate concurrent reads for the same missing key to prevent database stampedes.
 */
class CacheStampedeGuard {
  constructor() {
    this.inFlightRequests = new Map();
  }

  /**
   * Runs the supplier function only once if multiple concurrent callers request the same key.
   */
  async execute(key, supplierFn) {
    if (this.inFlightRequests.has(key)) {
      logger.info(`Stampede Guard: Coalescing concurrent request for key '${key}'`);
      return this.inFlightRequests.get(key);
    }

    const promise = (async () => {
      try {
        return await supplierFn();
      } finally {
        this.inFlightRequests.delete(key);
      }
    })();

    this.inFlightRequests.set(key, promise);
    return promise;
  }
}

const stampedeGuard = new CacheStampedeGuard();

module.exports = {
  CacheStampedeGuard,
  stampedeGuard
};
