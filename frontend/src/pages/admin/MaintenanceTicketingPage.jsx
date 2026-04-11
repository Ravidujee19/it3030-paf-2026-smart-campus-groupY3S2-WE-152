import React from 'react';
import { Outlet } from 'react-router-dom';

/**
 * MaintenanceTicketingPage Layout.
 * Acts as the parent container for TicketList, TicketForm, and TicketDetail
 * within the Admin and Staff Hubs.
 */
export default function MaintenanceTicketingPage() {
  return (
    <div style={{ animation: 'fadeIn 0.5s ease-out' }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '24px',
        padding: '0 8px' 
      }}>
        <h1 
          className="admin-card-title" 
          style={{ 
            fontSize: '1.75rem', 
            fontWeight: '800', 
            border: 'none', 
            margin: 0,
            color: '#1e293b' 
          }}
        >
          Maintenance & Incident Ticketing
        </h1>
      </div>

      {/* 
          CSS WRAPPER PRESERVED: 
          The <Outlet /> allows the router to swap between child components
          (List, New, Detail) while keeping this professional container.
      */}
      <div style={{ 
        background: '#fff', 
        borderRadius: '16px', 
        padding: '1rem', 
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        minHeight: '600px' // Ensure a consistent display area
      }}>
        <Outlet />
      </div>
    </div>
  );
}
