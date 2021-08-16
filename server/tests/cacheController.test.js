const { memoryLRU } = require('../services/lruCacheEngine');

describe('CacheController In-Memory Cache CRUD Test Suite', () => {
  test('Verifies in-memory LRU engine operations', () => {
    memoryLRU.set('test:order:1', { total: 49.99 }, 3600);
    const item = memoryLRU.get('test:order:1');
    expect(item).toEqual({ total: 49.99 });
  });
});
