import React, { useState } from 'react';

const LiveKeyExplorer = () => {
  const [searchKey, setSearchKey] = useState('');
  const [result, setResult] = useState(null);

  const sampleLookup = {
    'session:usr-9901:token': { value: '{"userId":"usr-9901","role":"admin"}', node: 'node-us-east-01', source: 'L1_MEMORY' },
    'product:sku-8812:price': { value: '{"sku":"sku-8812","price":99.95}', node: 'node-eu-central-01', source: 'L1_MEMORY' }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (sampleLookup[searchKey]) {
      setResult(sampleLookup[searchKey]);
    } else {
      setResult({ value: '{"status":"active","payload":"sample_cached_value"}', node: 'node-us-west-01', source: 'L2_STORE' });
    }
  };

  return (
    <div className="card">
      <div className="card-title">
        <span>Interactive Key Query & Routing Explorer</span>
      </div>

      <form onSubmit={handleSearch} style={{ display: 'flex', gap: '8px', marginBottom: '14px' }}>
        <input
          value={searchKey}
          onChange={(e) => setSearchKey(e.target.value)}
          placeholder="e.g. session:usr-9901:token"
          style={{
            flex: 1,
            background: '#090d16',
            border: '1px solid var(--border-color)',
            borderRadius: '4px',
            padding: '8px 12px',
            color: '#fff',
            fontFamily: 'JetBrains Mono'
          }}
        />
        <button type="submit" className="btn-primary">GET Key</button>
      </form>

      {result && (
        <div style={{
          background: '#080c14',
          border: '1px solid var(--border-color)',
          borderRadius: '4px',
          padding: '12px',
          fontFamily: 'JetBrains Mono',
          fontSize: '0.75rem'
        }}>
          <p style={{ color: 'var(--text-muted)' }}>Assigned Node: <strong style={{ color: 'var(--accent-cyan)' }}>{result.node}</strong></p>
          <p style={{ color: 'var(--text-muted)', margin: '4px 0' }}>Lookup Tier: <strong style={{ color: 'var(--accent-emerald)' }}>{result.source}</strong></p>
          <p style={{ color: '#fff', marginTop: '6px' }}>Payload: {result.value}</p>
        </div>
      )}
    </div>
  );
};

export default LiveKeyExplorer;
