import React, { useState } from 'react';

const SetKeyModal = ({ isOpen, onClose, onSet }) => {
  const [key, setKey] = useState('');
  const [value, setValue] = useState('');
  const [ttl, setTtl] = useState(3600);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSet({ key, value, ttlSeconds: parseInt(ttl, 10) });
    onClose();
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.75)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <div className="card" style={{ width: '440px', maxWidth: '90%' }}>
        <div className="card-title">
          <span>Set In-Memory Key</span>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', fontSize: '1.2rem' }}>✕</button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Cache Key</label>
            <input
              required
              value={key}
              onChange={(e) => setKey(e.target.value)}
              placeholder="e.g. user:session:1001"
              style={{ width: '100%', padding: '8px', background: '#090d16', border: '1px solid var(--border-color)', borderRadius: '4px', color: '#fff' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Value (JSON / String)</label>
            <input
              required
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder='e.g. {"authenticated": true}'
              style={{ width: '100%', padding: '8px', background: '#090d16', border: '1px solid var(--border-color)', borderRadius: '4px', color: '#fff' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '4px' }}>TTL (Seconds)</label>
            <input
              type="number"
              value={ttl}
              onChange={(e) => setTtl(e.target.value)}
              style={{ width: '100%', padding: '8px', background: '#090d16', border: '1px solid var(--border-color)', borderRadius: '4px', color: '#fff' }}
            />
          </div>

          <button type="submit" className="btn-primary" style={{ marginTop: '8px' }}>
            Store Key to Ring
          </button>
        </form>
      </div>
    </div>
  );
};

export default SetKeyModal;
