import React from 'react';

const ClusterNodesTable = () => {
  const nodes = [
    { id: 'node-us-east-01', host: '10.0.1.10:5001', status: 'ALIVE', memory: '412 MB / 1 GB', vnodes: 128 },
    { id: 'node-us-west-01', host: '10.0.2.20:5002', status: 'ALIVE', memory: '388 MB / 1 GB', vnodes: 128 },
    { id: 'node-eu-central-01', host: '10.0.3.30:5003', status: 'ALIVE', memory: '395 MB / 1 GB', vnodes: 128 },
    { id: 'node-ap-southeast-01', host: '10.0.4.40:5004', status: 'ALIVE', memory: '402 MB / 1 GB', vnodes: 128 }
  ];

  return (
    <div className="card">
      <div className="card-title">
        <span>Active Physical Cluster Nodes</span>
        <span style={{ fontSize: '0.75rem', color: '#10b981' }}>● 4/4 HEALTHY</span>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.8rem' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
              <th style={{ padding: '8px' }}>Node ID</th>
              <th style={{ padding: '8px' }}>Internal Endpoint</th>
              <th style={{ padding: '8px' }}>Memory Footprint</th>
              <th style={{ padding: '8px' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {nodes.map(n => (
              <tr key={n.id} style={{ borderBottom: '1px solid #141b29' }}>
                <td style={{ padding: '10px 8px', fontWeight: 600, color: '#fff' }}>{n.id}</td>
                <td style={{ padding: '10px 8px', fontFamily: 'JetBrains Mono', color: 'var(--text-muted)' }}>{n.host}</td>
                <td style={{ padding: '10px 8px', fontFamily: 'JetBrains Mono', color: 'var(--accent-cyan)' }}>{n.memory}</td>
                <td style={{ padding: '10px 8px' }}>
                  <span style={{
                    padding: '2px 8px',
                    borderRadius: '4px',
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    background: 'rgba(16, 185, 129, 0.2)',
                    color: '#10b981'
                  }}>
                    {n.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ClusterNodesTable;
