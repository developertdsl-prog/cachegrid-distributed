const { ConsistentHashRing } = require('../services/consistentHashRing');

describe('ConsistentHashRing Partitioning & Routing Test Suite', () => {
  test('Consistently maps the same key to the same physical node', () => {
    const ring = new ConsistentHashRing(64);
    ring.addNode('nodeA');
    ring.addNode('nodeB');
    ring.addNode('nodeC');

    const node1 = ring.getNode('user:profile:1001');
    const node2 = ring.getNode('user:profile:1001');

    expect(node1).toBe(node2);
    expect(['nodeA', 'nodeB', 'nodeC']).toContain(node1);
  });

  test('Gracefully redistributes keys after node removal', () => {
    const ring = new ConsistentHashRing(64);
    ring.addNode('nodeA');
    ring.addNode('nodeB');

    const key = 'session:active:8812';
    ring.removeNode('nodeA');

    const remainingNode = ring.getNode(key);
    expect(remainingNode).toBe('nodeB');
  });

  test('Returns null when no nodes are registered in the ring', () => {
    const emptyRing = new ConsistentHashRing(32);
    expect(emptyRing.getNode('anyKey')).toBeNull();
  });
});
