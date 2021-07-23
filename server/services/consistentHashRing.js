const crypto = require('crypto');
const logger = require('../utils/logger');

class ConsistentHashRing {
  constructor(virtualNodesCount = 128) {
    this.virtualNodesCount = virtualNodesCount;
    this.ring = []; // Array of { hash: number, nodeId: string } sorted by hash
    this.nodes = new Set();
  }

  /**
   * Computes a 32-bit positive integer hash for a string key using MD5.
   */
  hash(str) {
    const md5 = crypto.createHash('md5').update(str).digest('hex');
    // Parse first 8 characters into a 32-bit unsigned integer
    return parseInt(md5.slice(0, 8), 16);
  }

  /**
   * Adds a physical node to the hash ring by creating virtual nodes.
   */
  addNode(nodeId) {
    if (this.nodes.has(nodeId)) return;
    this.nodes.add(nodeId);

    for (let i = 0; i < this.virtualNodesCount; i++) {
      const vnodeKey = `${nodeId}#vnode-${i}`;
      const hashVal = this.hash(vnodeKey);
      this.ring.push({ hash: hashVal, nodeId, vnodeKey });
    }

    // Sort ring by hash ascending
    this.ring.sort((a, b) => a.hash - b.hash);
    logger.info(`Node '${nodeId}' added to hash ring with ${this.virtualNodesCount} virtual replicas. Total vnodes: ${this.ring.length}`);
  }

  /**
   * Removes a physical node and all its virtual nodes from the ring.
   */
  removeNode(nodeId) {
    if (!this.nodes.has(nodeId)) return;
    this.nodes.delete(nodeId);
    this.ring = this.ring.filter(item => item.nodeId !== nodeId);
    logger.info(`Node '${nodeId}' removed from hash ring. Remaining vnodes: ${this.ring.length}`);
  }

  /**
   * Locates the primary responsible node for a given key using binary search.
   */
  getNode(key) {
    if (this.ring.length === 0) return null;

    const keyHash = this.hash(key);
    let low = 0;
    let high = this.ring.length - 1;

    // Binary search for first virtual node with hash >= keyHash
    while (low <= high) {
      const mid = Math.floor((low + high) / 2);
      if (this.ring[mid].hash >= keyHash) {
        high = mid - 1;
      } else {
        low = mid + 1;
      }
    }

    // Wrap around to the start of the ring if keyHash exceeds maximum node hash
    const targetIdx = low >= this.ring.length ? 0 : low;
    return this.ring[targetIdx].nodeId;
  }

  /**
   * Returns current topology status.
   */
  getTopology() {
    return {
      physicalNodesCount: this.nodes.size,
      virtualNodesTotal: this.ring.length,
      nodes: Array.from(this.nodes)
    };
  }
}

// Global shared ring instance
const globalRing = new ConsistentHashRing(128);

module.exports = {
  ConsistentHashRing,
  globalRing
};
