const { LRUCacheEngine } = require('../services/lruCacheEngine');

describe('LRUCacheEngine In-Memory O(1) Eviction Test Suite', () => {
  test('Stores and retrieves key-value pair within capacity', () => {
    const lru = new LRUCacheEngine(3);
    lru.set('k1', 'val1');
    lru.set('k2', 'val2');

    expect(lru.get('k1')).toBe('val1');
    expect(lru.get('k2')).toBe('val2');
    expect(lru.get('k3')).toBeNull();
  });

  test('Evicts least recently used key when capacity is exceeded', () => {
    const lru = new LRUCacheEngine(2);
    lru.set('k1', 'val1');
    lru.set('k2', 'val2');

    // Access k1 to make k2 the least recently used
    lru.get('k1');

    // Insert k3 -> should evict k2
    lru.set('k3', 'val3');

    expect(lru.get('k1')).toBe('val1');
    expect(lru.get('k2')).toBeNull(); // Evicted!
    expect(lru.get('k3')).toBe('val3');
  });

  test('Honors TTL expiration for cached entries', async () => {
    const lru = new LRUCacheEngine(5);
    // 0.01 seconds TTL
    lru.set('shortKey', 'quickVal', 0.01);

    await new Promise(r => setTimeout(r, 20));
    expect(lru.get('shortKey')).toBeNull();
  });
});
