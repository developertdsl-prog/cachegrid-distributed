import React from 'react';

const Navbar = ({ onOpenSetModal }) => {
  return (
    <nav style={{
      background: '#0d1320',
      borderBottom: '1px solid var(--border-color)',
      padding: '14px 28px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{
          width: '32px',
          height: '32px',
          borderRadius: '6px',
          background: 'linear-gradient(135deg, #06b6d4, #3b82f6)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 800,
          color: '#fff',
          fontSize: '1.1rem'
        }}>
          ⚡
        </div>
        <div>
          <h1 style={{ fontSize: '1.2rem', fontWeight: 700 }}>
            CacheGrid<span style={{ color: 'var(--accent-cyan)' }}>.Distributed</span>
          </h1>
          <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Murmur3 Consistent Hashing Ring & In-Memory Grid</p>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          background: 'rgba(6, 182, 212, 0.1)',
          border: '1px solid rgba(6, 182, 212, 0.3)',
          padding: '5px 12px',
          borderRadius: '4px',
          fontSize: '0.75rem',
          color: 'var(--accent-cyan)',
          fontFamily: 'JetBrains Mono'
        }}>
          ● RING STATUS: BALANCED
        </div>
        <button className="btn-primary" onClick={onOpenSetModal}>
          + SET Cache Key
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
