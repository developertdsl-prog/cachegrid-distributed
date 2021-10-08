import React from 'react';

const ConsistentHashRingVisualizer = () => {
  const ringNodes = [
    { id: 'node-us-east-01', region: 'US East (N. Virginia)', vnodes: 128, range: '0x00000000 - 0x3FFFFFFF', keys: '25.4%' },
    { id: 'node-us-west-01', region: 'US West (Oregon)', vnodes: 128, range: '0x40000000 - 0x7FFFFFFF', keys: '24.8%' },
    { id: 'node-eu-central-01', region: 'EU Central (Frankfurt)', vnodes: 128, range: '0x80000000 - 0xBFFFFFFF', keys: '25.1%' },
    { id: 'node-ap-southeast-01', region: 'AP Southeast (Singapore)', vnodes: 128, range: '0xC0000000 - 0xFFFFFFFF', keys: '24.7%' }
  ];

  return (
    <div className="card">
      <div className="card-title">
        <span>Consistent Hashing Ring Partition Topology</span>
        <span style={{ fontSize: '0.75rem', color: 'var(--accent-cyan)', fontFamily: 'JetBrains Mono' }}>
          512 Total Virtual Nodes (Murmur3)
        </span>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '12px',
        background: '#090d16',
        padding: '16px',
        borderRadius: '6px'
      }}>
        {ringNodes.map(n => (
          <div key={n.id} style={{
            background: '#111726',
            border: '1px solid var(--border-color)',
            borderRadius: '6px',
            padding: '12px'
          }}>
            <p style={{ fontSize: '0.85rem', fontWeight: 700, color: '#fff' }}>{n.id}</p>
            <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '8px' }}>{n.region}</p>
            <div style={{ fontSize: '0.75rem', fontFamily: 'JetBrains Mono', color: 'var(--accent-emerald)' }}>
              Load Share: {n.keys}
            </div>
            <p style={{ fontSize: '0.65rem', color: '#64748b', fontFamily: 'JetBrains Mono', marginTop: '4px' }}>{n.range}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ConsistentHashRingVisualizer;
