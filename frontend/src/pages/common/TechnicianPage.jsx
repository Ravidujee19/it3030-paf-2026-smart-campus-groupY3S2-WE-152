import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getTicketsByAssignee, updateTicketStatus } from '../../services/ticketService';

const STATUS_CONFIG = {
  OPEN: { label: 'Open', color: '#3b82f6', bg: 'rgba(59,130,246,0.15)' },
  IN_PROGRESS: { label: 'In Progress', color: '#f59e0b', bg: 'rgba(245,158,11,0.15)' },
  RESOLVED: { label: 'Resolved', color: '#10b981', bg: 'rgba(16,185,129,0.15)' },
  CLOSED: { label: 'Closed', color: '#6b7280', bg: 'rgba(107,114,128,0.15)' },
  REJECTED: { label: 'Rejected', color: '#ef4444', bg: 'rgba(239,68,68,0.15)' },
};

const PRIORITY_CONFIG = {
  LOW: { label: 'Low', color: '#10b981' },
  MEDIUM: { label: 'Medium', color: '#f59e0b' },
  HIGH: { label: 'High', color: '#f97316' },
  CRITICAL: { label: 'Critical', color: '#ef4444' },
};

const TECHNICIAN_TRANSITIONS = {
  OPEN: ['IN_PROGRESS'],
  IN_PROGRESS: ['RESOLVED'],
  RESOLVED: [],
  CLOSED: [],
  REJECTED: [],
};

function TechnicianPage() {
  const { user } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    if (user?.id) {
      fetchAssignedTickets();
    }
  }, [user]);

  const fetchAssignedTickets = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getTicketsByAssignee(user.id);
      setTickets(data);
    } catch {
      setError('Failed to load assigned tickets. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (ticketId, newStatus) => {
    setUpdatingId(ticketId);
    try {
      await updateTicketStatus(ticketId, newStatus);
      setTickets((prev) =>
        prev.map((t) => (t.id === ticketId ? { ...t, status: newStatus } : t))
      );
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update status.');
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredTickets = statusFilter
    ? tickets.filter((t) => t.status === statusFilter)
    : tickets;

  const stats = {
    total: tickets.length,
    open: tickets.filter((t) => t.status === 'OPEN').length,
    inProgress: tickets.filter((t) => t.status === 'IN_PROGRESS').length,
    resolved: tickets.filter((t) => t.status === 'RESOLVED').length,
  };

  return (
    <div style={styles.page}>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>🔧 Technician Dashboard</h1>
          <p style={styles.subtitle}>Welcome, {user?.name} — manage your assigned tickets below</p>
        </div>
        <button style={styles.refreshBtn} onClick={fetchAssignedTickets}>
          ↻ Refresh
        </button>
      </div>

      {/* Stats */}
      <div style={styles.statsRow}>
        {[
          { label: 'Total Assigned', value: stats.total, color: '#6366f1' },
          { label: 'Open', value: stats.open, color: '#3b82f6' },
          { label: 'In Progress', value: stats.inProgress, color: '#f59e0b' },
          { label: 'Resolved', value: stats.resolved, color: '#10b981' },
        ].map((s) => (
          <div key={s.label} style={styles.statCard}>
            <span style={{ ...styles.statValue, color: s.color }}>{s.value}</span>
            <span style={styles.statLabel}>{s.label}</span>
          </div>
        ))}
      </div>

      {/* Filter */}
      <div style={styles.filterBar}>
        <select
          style={styles.filterSelect}
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">All Statuses</option>
          <option value="OPEN">Open</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="RESOLVED">Resolved</option>
          <option value="CLOSED">Closed</option>
        </select>
        <span style={styles.filterCount}>
          {filteredTickets.length} ticket{filteredTickets.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Content */}
      {loading ? (
        <div style={styles.center}>
          <div style={styles.spinner} />
          <p style={styles.dimText}>Loading assigned tickets...</p>
        </div>
      ) : error ? (
        <div style={styles.errorBox}>
          <p>{error}</p>
          <button style={styles.retryBtn} onClick={fetchAssignedTickets}>Retry</button>
        </div>
      ) : filteredTickets.length === 0 ? (
        <div style={styles.emptyBox}>
          <div style={styles.emptyIcon}>🎉</div>
          <h3 style={styles.emptyTitle}>
            {tickets.length === 0 ? 'No tickets assigned yet' : 'No tickets match this filter'}
          </h3>
          <p style={styles.dimText}>
            {tickets.length === 0
              ? 'An admin will assign tickets to you when needed.'
              : 'Try a different status filter.'}
          </p>
        </div>
      ) : (
        <div style={styles.ticketGrid}>
          {filteredTickets.map((ticket) => {
            const sc = STATUS_CONFIG[ticket.status] || STATUS_CONFIG.OPEN;
            const pc = PRIORITY_CONFIG[ticket.priority] || PRIORITY_CONFIG.LOW;
            const nextStatuses = TECHNICIAN_TRANSITIONS[ticket.status] || [];

            return (
              <div key={ticket.id} style={styles.card}>
                <div style={styles.cardTop}>
                  <span style={styles.ticketId}>#{ticket.id}</span>
                  <span style={{ ...styles.statusBadge, color: sc.color, background: sc.bg }}>
                    {sc.label}
                  </span>
                </div>
                <h3 style={styles.cardTitle}>{ticket.title}</h3>
                <p style={styles.cardDesc}>{ticket.description}</p>

                <div style={styles.metaRow}>
                  <span>📍 {ticket.location}</span>
                  <span style={{ color: pc.color, fontWeight: 600 }}>▲ {pc.label}</span>
                </div>

                {ticket.createdByName && (
                  <p style={styles.creatorText}>Reported by: {ticket.createdByName}</p>
                )}

                {/* Status Action Buttons */}
                {nextStatuses.length > 0 && (
                  <div style={styles.actionRow}>
                    {nextStatuses.map((next) => (
                      <button
                        key={next}
                        style={{
                          ...styles.actionBtn,
                          opacity: updatingId === ticket.id ? 0.6 : 1,
                        }}
                        disabled={updatingId === ticket.id}
                        onClick={() => handleStatusUpdate(ticket.id, next)}
                      >
                        {updatingId === ticket.id
                          ? 'Updating...'
                          : `Mark as ${STATUS_CONFIG[next]?.label || next}`}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

const styles = {
  page: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
    padding: '2rem',
    fontFamily: "'Inter', sans-serif",
    color: '#f1f5f9',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '1.5rem',
    flexWrap: 'wrap',
    gap: '1rem',
  },
  title: { fontSize: '1.75rem', fontWeight: 700, margin: 0 },
  subtitle: { color: '#94a3b8', margin: '4px 0 0', fontSize: '0.9rem' },
  refreshBtn: {
    padding: '8px 18px',
    background: 'rgba(99,102,241,0.1)',
    color: '#818cf8',
    border: '1px solid rgba(99,102,241,0.3)',
    borderRadius: '10px',
    cursor: 'pointer',
    fontSize: '0.875rem',
  },
  statsRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
    gap: '1rem',
    marginBottom: '1.5rem',
  },
  statCard: {
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '12px',
    padding: '1rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '4px',
  },
  statValue: { fontSize: '2rem', fontWeight: 700 },
  statLabel: { color: '#64748b', fontSize: '0.75rem', textAlign: 'center' },
  filterBar: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    marginBottom: '1.5rem',
  },
  filterSelect: {
    padding: '8px 14px',
    background: '#1e293b',
    color: '#f1f5f9',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '10px',
    fontSize: '0.875rem',
    cursor: 'pointer',
    outline: 'none',
  },
  filterCount: { color: '#64748b', fontSize: '0.875rem' },
  center: { textAlign: 'center', padding: '3rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' },
  spinner: {
    width: '36px', height: '36px',
    border: '3px solid rgba(99,102,241,0.2)',
    borderTop: '3px solid #6366f1',
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite',
  },
  dimText: { color: '#64748b', fontSize: '0.875rem', margin: 0 },
  errorBox: {
    background: 'rgba(239,68,68,0.08)',
    border: '1px solid rgba(239,68,68,0.2)',
    borderRadius: '12px',
    padding: '1.5rem',
    textAlign: 'center',
    color: '#f87171',
  },
  retryBtn: {
    marginTop: '8px',
    padding: '8px 18px',
    background: 'rgba(239,68,68,0.1)',
    color: '#f87171',
    border: '1px solid rgba(239,68,68,0.3)',
    borderRadius: '8px',
    cursor: 'pointer',
  },
  emptyBox: {
    textAlign: 'center',
    padding: '4rem 2rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0.5rem',
  },
  emptyIcon: { fontSize: '3rem' },
  emptyTitle: { fontSize: '1.15rem', fontWeight: 600, margin: 0 },
  ticketGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
    gap: '1.25rem',
  },
  card: {
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '16px',
    padding: '1.5rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    transition: 'border-color 0.2s',
  },
  cardTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  ticketId: { color: '#64748b', fontSize: '0.8rem', fontWeight: 600 },
  statusBadge: {
    padding: '3px 10px',
    borderRadius: '20px',
    fontSize: '0.75rem',
    fontWeight: 600,
  },
  cardTitle: { fontSize: '1rem', fontWeight: 600, margin: '4px 0', color: '#f1f5f9' },
  cardDesc: { color: '#94a3b8', fontSize: '0.85rem', margin: 0, lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' },
  metaRow: { display: 'flex', justifyContent: 'space-between', color: '#94a3b8', fontSize: '0.8rem', marginTop: '4px' },
  creatorText: { color: '#64748b', fontSize: '0.78rem', margin: 0 },
  actionRow: { display: 'flex', gap: '8px', marginTop: '8px', flexWrap: 'wrap' },
  actionBtn: {
    padding: '7px 14px',
    background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '0.8rem',
    fontWeight: 500,
    transition: 'opacity 0.2s',
  },
};

export default TechnicianPage;