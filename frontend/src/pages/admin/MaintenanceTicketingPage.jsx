import React, { useState, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import TicketList from '../../components/tickets/TicketList';
import TicketForm from '../../components/tickets/TicketForm';
import TicketDetail from '../../components/tickets/TicketDetail';
import './MaintenanceTicketingPage.css';

/**
 * MaintenanceTicketingPage — Full dashboard orchestrator for Module C.
 *
 * Manages three views internally:
 *   • 'list'   — TicketList with overview cards
 *   • 'create' — TicketForm for new ticket submission
 *   • 'detail' — TicketDetail with comments and status management
 */
export default function MaintenanceTicketingPage() {
  const { user } = useAuth();
  const currentUserId = user?.id || user?.userId || 1; // Fallback to 1 if not available
  
  const [view, setView] = useState('list');       // 'list' | 'create' | 'detail'
  const [selectedTicketId, setSelectedTicketId] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Navigate to detail view
  const handleViewDetails = useCallback((ticketId) => {
    setSelectedTicketId(ticketId);
    setView('detail');
  }, []);

  // Navigate back to list (and optionally refresh)
  const handleBackToList = useCallback(() => {
    setView('list');
    setSelectedTicketId(null);
    setRefreshTrigger((prev) => prev + 1);
  }, []);

  // Ticket created successfully
  const handleTicketCreated = useCallback(() => {
    setView('list');
    setRefreshTrigger((prev) => prev + 1);
  }, []);

  return (
    <div className="maintenance-page">
      {/* Page Header — only visible on list view */}
      {view === 'list' && (
        <div className="maintenance-page-header">
          <div className="page-header-text">
            <h1 className="page-title">
              <span className="page-title-icon">🔧</span>
              Maintenance & Incident Ticketing
            </h1>
            <p className="page-subtitle">
              Manage, track, and resolve campus maintenance requests and incidents.
            </p>
          </div>
          <button
            onClick={() => setView('create')}
            className="btn-new-ticket"
            id="btn-create-ticket"
          >
            <span className="btn-plus">+</span>
            New Ticket
          </button>
        </div>
      )}

      {/* View: Ticket List */}
      {view === 'list' && (
        <TicketList
          onViewDetails={handleViewDetails}
          refreshTrigger={refreshTrigger}
        />
      )}

      {/* View: Create Ticket */}
      {view === 'create' && (
        <div className="create-view-wrapper">
          <div className="create-view-header">
            <button
              onClick={handleBackToList}
              className="btn-back-to-list"
            >
              <span className="back-arrow-icon">←</span>
              Back to Tickets
            </button>
          </div>
          <TicketForm
            onSuccess={handleTicketCreated}
            onCancel={handleBackToList}
          />
        </div>
      )}

      {/* View: Ticket Detail */}
      {view === 'detail' && selectedTicketId && (
        <TicketDetail
          ticketId={selectedTicketId}
          onBack={handleBackToList}
          currentUserId={currentUserId}
        />
      )}
    </div>
  );
}
