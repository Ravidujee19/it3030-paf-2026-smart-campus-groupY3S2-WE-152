import React, { useState, useEffect } from 'react';
import analyticsService from '../../services/analyticsService';
import './AdminDashboard.css';

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const result = await analyticsService.getAnalyticsSummary();
        setData(result);
      } catch (err) {
        setError('Failed to load analytics data.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) return (
    <div className="admin-loading-container">
      <div className="admin-spinner"></div>
      <p>Calculating campus insights...</p>
    </div>
  );

  if (error) return (
    <div className="admin-error-container">
      <p>{error}</p>
    </div>
  );

  const { stats, topResources, peakHours } = data || {};

  return (
    <div className="admin-dashboard-container">
      <div className="dashboard-intro">
        <h1 className="admin-header-title" style={{ fontSize: '2rem', marginBottom: '8px' }}>Dashboard Overview</h1>
        <p style={{ color: 'var(--admin-text-light)', marginBottom: '32px' }}>Welcome back! Here's what's happening across the campus today.</p>
      </div>

      {/* Quick Stats Grid */}
      <div className="admin-grid" style={{ marginBottom: '32px' }}>
        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-info">
            <span className="stat-label">Total Bookings</span>
            <p className="stat-value">{stats?.totalBookings || 0}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: '#ecfdf5', color: '#10b981' }}>✅</div>
          <div className="stat-info">
            <span className="stat-label">Confirmed Slots</span>
            <p className="stat-value">{stats?.activeBookings || 0}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: '#fff7ed', color: '#f59e0b' }}>🏁</div>
          <div className="stat-info">
            <span className="stat-label">Completed Units</span>
            <p className="stat-value">{stats?.completedBookings || 0}</p>
          </div>
        </div>
      </div>

      <div className="dashboard-content-grid">
        {/* Top Resources - Bar Chart */}
        <div className="admin-card">
          <h2 className="admin-card-title">🔥 Top Utilized Resources</h2>
          <div className="analytics-bar-chart">
            {topResources && Object.entries(topResources).length > 0 ? (
              Object.entries(topResources).map(([name, count], index) => {
                const maxCount = Math.max(...Object.values(topResources));
                const percentage = (count / maxCount) * 100;
                return (
                  <div key={name} className="analytics-bar-row">
                    <div className="bar-info">
                      <span className="bar-name">{name}</span>
                      <span className="bar-count">{count} bookings</span>
                    </div>
                    <div className="bar-background">
                      <div 
                        className="bar-foreground" 
                        style={{ width: `${percentage}%`, transitionDelay: `${index * 100}ms` }}
                      ></div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="no-data-msg">No resource usage data available yet.</div>
            )}
          </div>
        </div>

        {/* Peak Hours - Distribution */}
        <div className="admin-card">
          <h2 className="admin-card-title">⏰ Peak Booking Hours</h2>
          <div className="analytics-hours-container">
            <div className="hours-chart">
              {peakHours && Object.entries(peakHours).map(([hour, count]) => {
                const maxHourCount = Math.max(...Object.values(peakHours)) || 1;
                const heightPercentage = (count / maxHourCount) * 100;
                return (
                  <div key={hour} className="hour-bar-column">
                    <div className="hour-bar-wrapper">
                      <div 
                        className="hour-bar-inner" 
                        style={{ height: `${Math.max(heightPercentage, 2)}%` }} // Min height for visibility
                        title={`${hour}:00 - ${count} bookings`}
                      ></div>
                    </div>
                    <span className="hour-tick">{formatHour(hour)}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function formatHour(hour) {
  const h = parseInt(hour, 10);
  if (h === 0) return '12A';
  if (h < 12) return `${h}A`;
  if (h === 12) return '12P';
  return `${h - 12}P`;
}
