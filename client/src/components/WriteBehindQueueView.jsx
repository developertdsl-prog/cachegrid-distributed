import React from 'react';

const WriteBehindQueueView = () => {
  const tasks = [
    { id: 'WB-101', key: 'product:sku-8812:price', op: 'UPSERT', status: 'PROCESSED' },
    { id: 'WB-102', key: 'session:usr-9901:token', op: 'UPSERT', status: 'PROCESSED' },
    { id: 'WB-103', key: 'config:feature-flags', op: 'UPSERT', status: 'PROCESSED' }
  ];

  return (
    <div className="card">
      <div className="card-title">
        <span>Asynchronous Write-Behind Queue</span>
        <span style={{ fontSize: '0.7rem', color: '#10b981', fontFamily: 'JetBrains Mono' }}>● FLUSH INTERVAL: 2000MS</span>
      </div>

      <div style={{
        background: '#080c14',
        border: '1px solid var(--border-color)',
        borderRadius: '6px',
        padding: '12px',
        fontFamily: 'JetBrains Mono',
        fontSize: '0.75rem'
      }}>
        {tasks.map(t => (
          <div key={t.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ color: 'var(--accent-cyan)' }}>{t.key}</span>
            <span style={{ color: 'var(--accent-emerald)', fontWeight: 600 }}>[{t.status}]</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WriteBehindQueueView;
