class Node {
  constructor(key, value, expiresAt) {
    this.key = key;
    this.value = value;
    this.expiresAt = expiresAt;
    this.prev = null;
    this.next = null;
  }
}

class LRUCacheEngine {
  constructor(capacity = 50000) {
    this.capacity = capacity;
    this.cache = new Map();
    this.head = new Node(null, null, null);
    this.tail = new Node(null, null, null);
    this.head.next = this.tail;
    this.tail.prev = this.head;

    this.hits = 0;
    this.misses = 0;
  }

  _remove(node) {
    node.prev.next = node.next;
    node.next.prev = node.prev;
  }

  _addToFront(node) {
    node.next = this.head.next;
    node.prev = this.head;
    this.head.next.prev = node;
    this.head.next = node;
  }

  get(key) {
    if (!this.cache.has(key)) {
      this.misses++;
      return null;
    }

    const node = this.cache.get(key);
    // Check TTL expiration
    if (node.expiresAt && Date.now() > node.expiresAt) {
      this.delete(key);
      this.misses++;
      return null;
    }

    // Move to front (most recently used)
    this._remove(node);
    this._addToFront(node);
    this.hits++;
    return node.value;
  }

  set(key, value, ttlSeconds = 3600) {
    const expiresAt = ttlSeconds ? Date.now() + ttlSeconds * 1000 : null;

    if (this.cache.has(key)) {
      const existing = this.cache.get(key);
      existing.value = value;
      existing.expiresAt = expiresAt;
      this._remove(existing);
      this._addToFront(existing);
      return;
    }

    if (this.cache.size >= this.capacity) {
      // Evict least recently used (node before tail)
      const lru = this.tail.prev;
      this._remove(lru);
      this.cache.delete(lru.key);
    }

    const newNode = new Node(key, value, expiresAt);
    this.cache.set(key, newNode);
    this._addToFront(newNode);
  }

  delete(key) {
    if (!this.cache.has(key)) return false;
    const node = this.cache.get(key);
    this._remove(node);
    this.cache.delete(key);
    return true;
  }

  size() {
    return this.cache.size;
  }

  getStats() {
    const total = this.hits + this.misses;
    const hitRate = total > 0 ? ((this.hits / total) * 100).toFixed(1) : 0;
    return {
      size: this.cache.size,
      capacity: this.capacity,
      hits: this.hits,
      misses: this.misses,
      hitRatePercentage: parseFloat(hitRate)
    };
  }
}

const memoryLRU = new LRUCacheEngine(50000);

module.exports = {
  LRUCacheEngine,
  memoryLRU
};
