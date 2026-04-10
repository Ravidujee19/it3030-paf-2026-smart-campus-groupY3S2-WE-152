import React, { useState, useEffect } from 'react';
import TicketList from '../../components/tickets/TicketList';
import { assignTechnician, updateTicketStatus } from '../../services/ticketService';


// Remove this if not need
export default function MaintenanceTicketingPage() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [technicianId, setTechnicianId] = useState('');
  const [newStatus, setNewStatus] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [actionMsg, setActionMsg] = useState(null);

  const handleViewDetails = (ticketId) => {
    setSelectedTicket(ticketId);
    setTechnicianId('');
    setNewStatus('');
    setActionMsg(null);
  };

  const handleAssign = async () => {
    if (!technicianId) return;
    setActionLoading(true);
    setActionMsg(null);
    try {
      await assignTechnician(selectedTicket, Number(technicianId));
      setActionMsg({ type: 'success', text: `Technician ID ${technicianId} assigned to ticket #${selectedTicket}` });
      setRefreshTrigger((p) => p + 1);
    } catch (err) {
      setActionMsg({ type: 'error', text: err.response?.data?.message || 'Failed to assign technician.' });
    } finally {
      setActionLoading(false);
    }
  };

  const handleStatusChange = async () => {
    if (!newStatus) return;
    setActionLoading(true);
    setActionMsg(null);
    try {
      await updateTicketStatus(selectedTicket, newStatus);
      setActionMsg({ type: 'success', text: `Ticket #${selectedTicket} status updated to ${newStatus}` });
      setRefreshTrigger((p) => p + 1);
      setSelectedTicket(null);
    } catch (err) {
      setActionMsg({ type: 'error', text: err.response?.data?.message || 'Invalid status transition.' });
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Maintenance & Incident Ticketing</h1>
          <p style={styles.subtitle}>View, assign, and manage all campus maintenance tickets</p>
        </div>
      </div>
      {selectedTicket && (
        <div style={styles.actionPanel}>
          <div style={styles.actionPanelHeader}>
            <h3 style={styles.actionTitle}>⚙️ Actions for Ticket #{selectedTicket}</h3>
            <button style={styles.closeBtn} onClick={() => setSelectedTicket(null)}>✕</button>
          </div>

          {actionMsg && (
            <div style={{
              ...styles.actionMsg,
              background: actionMsg.type === 'success' ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
              borderColor: actionMsg.type === 'success' ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.3)',
              color: actionMsg.type === 'success' ? '#10b981' : '#ef4444',
            }}>
              {actionMsg.text}
            </div>
          )}

          <div style={styles.actionRow}>
            {/* Assign Technician */}
            <div style={styles.actionGroup}>
              <label style={styles.actionLabel}>Assign Technician (User ID)</label>
              <div style={styles.inputRow}>
                <input
                  type="number"
                  placeholder="e.g. 12"
                  value={technicianId}
                  onChange={(e) => setTechnicianId(e.target.value)}
                  style={styles.input}
                />
                <button
                  style={{ ...styles.btn, ...styles.btnPrimary }}
                  onClick={handleAssign}
                  disabled={actionLoading || !technicianId}
                >
                  {actionLoading ? '...' : 'Assign'}
                </button>
              </div>
            </div>

            {/* Change Status */}
            <div style={styles.actionGroup}>
              <label style={styles.actionLabel}>Change Status</label>
              <div style={styles.inputRow}>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  style={styles.select}
                >
                  <option value="">Select new status</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="RESOLVED">Resolved</option>
                  <option value="CLOSED">Closed</option>
                  <option value="REJECTED">Rejected</option>
                </select>
                <button
                  style={{ ...styles.btn, ...styles.btnWarning }}
                  onClick={handleStatusChange}
                  disabled={actionLoading || !newStatus}
                >
                  {actionLoading ? '...' : 'Update'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Ticket List */}
      <TicketList
        onViewDetails={handleViewDetails}
        refreshTrigger={refreshTrigger}
      />
    </div>
  );
}

const styles = {
  page: {
    padding: '0',
    fontFamily: "'Inter', sans-serif",
    color: '#f1f5f9',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '1.5rem',
  },
  title: {
    fontSize: '1.5rem',
    fontWeight: 700,
    margin: 0,
    color: '#f1f5f9',
  },
  subtitle: {
    color: '#94a3b8',
    fontSize: '0.875rem',
    margin: '4px 0 0',
  },
  actionPanel: {
    background: 'rgba(99,102,241,0.07)',
    border: '1px solid rgba(99,102,241,0.25)',
    borderRadius: '14px',
    padding: '1.25rem 1.5rem',
    marginBottom: '1.5rem',
  },
  actionPanelHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1rem',
  },
  actionTitle: {
    fontSize: '1rem',
    fontWeight: 600,
    margin: 0,
    color: '#c7d2fe',
  },
  closeBtn: {
    background: 'transparent',
    border: 'none',
    color: '#64748b',
    cursor: 'pointer',
    fontSize: '1rem',
    padding: '4px 8px',
    borderRadius: '6px',
  },
  actionMsg: {
    padding: '10px 14px',
    borderRadius: '8px',
    border: '1px solid',
    fontSize: '0.85rem',
    marginBottom: '1rem',
    fontWeight: 500,
  },
  actionRow: {
    display: 'flex',
    gap: '1.5rem',
    flexWrap: 'wrap',
  },
  actionGroup: {
    flex: 1,
    minWidth: '220px',
  },
  actionLabel: {
    display: 'block',
    color: '#94a3b8',
    fontSize: '0.78rem',
    fontWeight: 500,
    marginBottom: '6px',
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
  },
  inputRow: {
    display: 'flex',
    gap: '8px',
  },
  input: {
    flex: 1,
    padding: '8px 12px',
    background: '#1e293b',
    color: '#f1f5f9',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '8px',
    fontSize: '0.875rem',
    outline: 'none',
  },
  select: {
    flex: 1,
    padding: '8px 12px',
    background: '#1e293b',
    color: '#f1f5f9',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '8px',
    fontSize: '0.875rem',
    outline: 'none',
    cursor: 'pointer',
  },
  btn: {
    padding: '8px 16px',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '0.875rem',
    fontWeight: 600,
    transition: 'opacity 0.2s',
    whiteSpace: 'nowrap',
  },
  btnPrimary: {
    background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
    color: '#fff',
  },
  btnWarning: {
    background: 'linear-gradient(135deg, #f59e0b, #d97706)',
    color: '#fff',
  },
};
