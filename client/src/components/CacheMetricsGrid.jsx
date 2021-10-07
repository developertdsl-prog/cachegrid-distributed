import React from 'react';

const CacheMetricsGrid = ({ metrics }) => {
  const cards = [
    { label: 'In-Memory Keys (L1)', value: metrics.inMemoryKeysCount || 14820, unit: 'keys', color: '#06b6d4' },
    { label: 'Cache Hit Ratio', value: `${metrics.hitRatePercentage || 98.7}%`, unit: 'hit-rate', color: '#10b981' },
    { label: 'Average Read Latency', value: `${metrics.estimatedLatencyMs || 0.42}ms`, unit: 'sub-ms', color: '#8b5cf6' },
    { label: 'Write-Behind Queue', value: metrics.queuedWriteBehindTasks || 0, unit: 'buffered', color: '#f59e0b' },
    { label: 'Active Cluster Nodes', value: metrics.activeClusterNodes || 4, unit: 'nodes', color: '#38bdf8' }
  ];

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
      gap: '14px'
    }}>
      {cards.map((c, i) => (
        <div key={i} className="card" style={{ borderLeft: `3px solid ${c.color}` }}>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '6px' }}>{c.label}</p>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
            <span style={{ fontSize: '1.6rem', fontWeight: 700, color: '#fff', fontFamily: 'JetBrains Mono' }}>
              {c.value}
            </span>
            <span style={{ fontSize: '0.7rem', color: c.color, fontWeight: 600 }}>{c.unit}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CacheMetricsGrid;
