import React, { useState } from 'react';
import TicketForm from '../../components/tickets/TicketForm';
import TicketList from '../../components/tickets/TicketList';

function StaffTicketsPage() {
  const [view, setView] = useState('list');
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleTicketCreated = () => {
    setView('list');
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <div style={styles.page}>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Maintenance Tickets</h1>
          <p style={styles.subtitle}>Submit and track campus maintenance requests</p>
        </div>
        <div style={styles.tabBar}>
          <button
            style={{ ...styles.tab, ...(view === 'list' ? styles.tabActive : {}) }}
            onClick={() => setView('list')}
          >
            📋 All Tickets
          </button>
          <button
            style={{ ...styles.tab, ...(view === 'form' ? styles.tabActive : {}) }}
            onClick={() => setView('form')}
          >
            ➕ New Ticket
          </button>
        </div>
      </div>

      {/* Content */}
      <div style={styles.content}>
        {view === 'form' ? (
          <TicketForm
            onSuccess={handleTicketCreated}
            onCancel={() => setView('list')}
          />
        ) : (
          <TicketList refreshTrigger={refreshTrigger} />
        )}
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
    padding: '2rem',
    fontFamily: "'Inter', sans-serif",
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
    gap: '1rem',
    marginBottom: '2rem',
  },
  title: {
    fontSize: '1.75rem',
    fontWeight: 700,
    color: '#f1f5f9',
    margin: 0,
  },
  subtitle: {
    color: '#94a3b8',
    fontSize: '0.9rem',
    margin: '4px 0 0',
  },
  tabBar: {
    display: 'flex',
    gap: '8px',
    background: 'rgba(255,255,255,0.05)',
    borderRadius: '12px',
    padding: '4px',
  },
  tab: {
    padding: '8px 20px',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '0.875rem',
    fontWeight: 500,
    color: '#94a3b8',
    background: 'transparent',
    transition: 'all 0.2s',
  },
  tabActive: {
    background: '#6366f1',
    color: '#fff',
    boxShadow: '0 2px 12px rgba(99,102,241,0.4)',
  },
  content: {
    maxWidth: '1100px',
    margin: '0 auto',
  },
};

export default StaffTicketsPage;
