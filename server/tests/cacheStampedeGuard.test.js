const { CacheStampedeGuard } = require('../services/cacheStampedeGuard');

describe('CacheStampedeGuard Singleflight Concurrency Test Suite', () => {
  test('Executes supplier function only once for concurrent requests', async () => {
    const guard = new CacheStampedeGuard();
    let executionCount = 0;

    const expensiveDbCall = async () => {
      executionCount++;
      await new Promise(r => setTimeout(r, 30));
      return { result: 'database_payload' };
    };

    // 5 concurrent requests for same key
    const promises = [
      guard.execute('hotKey', expensiveDbCall),
      guard.execute('hotKey', expensiveDbCall),
      guard.execute('hotKey', expensiveDbCall),
      guard.execute('hotKey', expensiveDbCall),
      guard.execute('hotKey', expensiveDbCall)
    ];

    const results = await Promise.all(promises);
    expect(executionCount).toBe(1); // Exactly 1 DB call!
    results.forEach(res => {
      expect(res.result).toBe('database_payload');
    });
  });
});
