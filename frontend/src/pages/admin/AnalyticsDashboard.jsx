import React, { useState, useEffect } from 'react';
import analyticsService from '../../services/analyticsService';
import './AnalyticsDashboard.css';

const AnalyticsDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAnalytics();
  }, []);

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

  if (loading) return (
    <div className="analytics-loading">
      <div className="spinner"></div>
      <p>Calculating insights...</p>
    </div>
  );

  if (error) return <div className="analytics-error">{error}</div>;

  const { stats, topResources, peakHours } = data || {};

  return (
    <div className="analytics-dashboard">
      <header className="dashboard-header">
        <h1>Admin Analytics Insights</h1>
        <p>Real-time usage tracking and resource performance.</p>
      </header>

      {/* Quick Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">📅</div>
          <div className="stat-content">
            <h3>Total Bookings</h3>
            <p className="stat-value">{stats?.totalBookings || 0}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <h3>Confirmed</h3>
            <p className="stat-value">{stats?.activeBookings || 0}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🏁</div>
          <div className="stat-content">
            <h3>Completed</h3>
            <p className="stat-value">{stats?.completedBookings || 0}</p>
          </div>
        </div>
      </div>

      <div className="charts-container">
        {/* Top Resources - Bar Chart (CSS) */}
        <section className="chart-section">
          <h2>🔥 Top 5 Resources by Usage</h2>
          <div className="bar-chart">
            {topResources && Object.entries(topResources).length > 0 ? (
              Object.entries(topResources).map(([name, count], index) => {
                const maxCount = Math.max(...Object.values(topResources));
                const percentage = (count / maxCount) * 100;
                return (
                  <div key={name} className="bar-row">
                    <span className="bar-label">{name}</span>
                    <div className="bar-wrapper">
                      <div 
                        className="bar-fill" 
                        style={{ width: `${percentage}%`, animationDelay: `${index * 0.1}s` }}
                      >
                        <span className="bar-value">{count}</span>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="no-data">No usage data available yet.</p>
            )}
          </div>
        </section>

        {/* Peak Hours - Line-style Chart (CSS) */}
        <section className="chart-section">
          <h2>⏰ Peak Booking Hours (24h)</h2>
          <div className="hours-grid">
            {peakHours && Object.entries(peakHours).map(([hour, count]) => {
              const maxHourCount = Math.max(...Object.values(peakHours)) || 1;
              const heightPercentage = (count / maxHourCount) * 100;
              return (
                <div key={hour} className="hour-col">
                  <div className="hour-bar-wrapper">
                    <div 
                      className="hour-bar-fill" 
                      style={{ height: `${heightPercentage}%` }}
                      title={`${hour}:00 - ${count} bookings`}
                    ></div>
                  </div>
                  <span className="hour-label">{indexToHour(hour)}</span>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
};

const indexToHour = (hour) => {
  const h = parseInt(hour, 10);
  if (h === 0) return '12AM';
  if (h < 12) return `${h}AM`;
  if (h === 12) return '12PM';
  return `${h - 12}PM`;
};

export default AnalyticsDashboard;
