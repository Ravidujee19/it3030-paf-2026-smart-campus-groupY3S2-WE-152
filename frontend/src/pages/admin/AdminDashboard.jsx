import React, { useState, useEffect } from 'react';
import axios from 'axios';
import adminHero from '../../assets/admin-hero.png';
import './AdminDashboard.css';

// Inline Professional SVGs (Since external icons were blocked)
const Icons = {
  Activity: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>,
  Calendar: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>,
  Users: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>,
  Alert: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>,
  Trends: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>
};

const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:8081/api/analytics/summary', { withCredentials: true });
      setData(response.data);
    } catch (err) {
      console.error('Error fetching analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !data) {
    return (
      <div className="dashboard-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', color: '#64748b' }}>
          <div className="loading-spinner" style={{ marginBottom: '16px' }}></div>
          <p style={{ fontWeight: 700 }}>Initializing Analytical Engine...</p>
        </div>
      </div>
    );
  }

  const { stats = {}, topResources = {}, peakHours = {}, heatmap = {}, locations = {}, efficiency = {}, insights = [] } = data;

  // Constants for Charting
  const days = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"];
  const hours = Array.from({length: 24}, (_, i) => i);

  return (
    <div className="dashboard-container">
      <header 
        className="dashboard-header"
        style={{ 
          backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.5), rgba(15, 23, 42, 0.75)), url(${adminHero})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          padding: '4rem 3rem',
          borderRadius: '24px',
          marginBottom: '2rem',
          color: 'white'
        }}
      >
        <div>
          <h1 style={{ color: 'white', textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>Analytical Hub</h1>
          <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '1.2rem' }}>Real-time campus utilization and resource intelligence.</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="kpi-trend positive" onClick={fetchAnalytics} style={{ border: 'none', cursor: 'pointer', padding: '10px 24px', borderRadius: '12px' }}>
            Refinement Sync ✓
          </button>
        </div>
      </header>

      {/* KPI STRIP */}
      <div className="kpi-grid">
        <div className="kpi-card">
          <span className="kpi-label">Total Reservations</span>
          <div className="kpi-value-row">
            <span className="kpi-value">{stats.totalBookings || 0}</span>
            <span className="kpi-trend positive">+8.4%</span>
          </div>
        </div>
        <div className="kpi-card">
          <span className="kpi-label">Utilization Rate</span>
          <div className="kpi-value-row">
            <span className="kpi-value">{stats.utilizationTrend || '0%'}</span>
            <span className="kpi-trend positive">Stable</span>
          </div>
        </div>
        <div className="kpi-card">
          <span className="kpi-label">Campus Efficiency</span>
          <div className="kpi-value-row">
            <span className="kpi-value">{stats.efficiencyRate || '0%'}</span>
            <span className="kpi-trend positive">+4.2%</span>
          </div>
        </div>
        <div className="kpi-card">
          <span className="kpi-label">Pending Reviews</span>
          <div className="kpi-value-row">
            <span className="kpi-value">{stats.pendingBookings || 0}</span>
            <span className={`kpi-trend ${(stats.pendingBookings || 0) > 5 ? 'negative' : 'positive'}`}>
              {(stats.pendingBookings || 0) > 5 ? 'High Load' : 'Minimal'}
            </span>
          </div>
        </div>
      </div>

      <div className="analytics-layout">
        <main className="analytics-main">
          
          {/* TOP RESOURCES BAR CHART (SVG) */}
          <div className="chart-card">
            <h3><Icons.Activity /> Utilization Distribution (Top Resources)</h3>
            <div style={{ height: '260px', position: 'relative' }}>
              <svg width="100%" height="100%" viewBox="0 0 600 240" preserveAspectRatio="none">
                {Object.entries(topResources).map(([name, count], index) => {
                  const counts = Object.values(topResources);
                  const maxCount = counts.length > 0 ? Math.max(...counts, 1) : 1;
                  const barHeight = (count / maxCount) * 180;
                  const xPos = index * (600 / Math.max(Object.keys(topResources).length, 1)) + 40;
                  return (
                    <g key={name}>
                      <rect 
                        x={xPos} 
                        y={200 - barHeight} 
                        width="40" 
                        height={barHeight} 
                        className="bar-rect" 
                        style={{'--target-height': `${barHeight}px`}}
                      />
                      <text x={xPos + 20} y="225" textAnchor="middle" fontSize="11" fill="#64748b" fontWeight="600">
                        {name.length > 10 ? name.substring(0, 8) + '..' : name}
                      </text>
                      <text x={xPos + 20} y={190 - barHeight} textAnchor="middle" fontSize="12" fill="#1e293b" fontWeight="800">
                        {count}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>
          </div>

          {/* TEMPORAL HEATMAP */}
          <div className="chart-card">
            <h3><Icons.Calendar /> Temporal Density Heatmap</h3>
            <div className="heatmap-container" style={{ overflowX: 'auto' }}>
              <div className="heatmap-grid" style={{ minWidth: '700px' }}>
                <div /> {/* Top left spacer */}
                {hours.map(h => (
                   <div key={h} className="heatmap-hour-label">{h}:00</div>
                ))}
                
                {days.map(day => (
                  <React.Fragment key={day}>
                    <div className="heatmap-day-label">{day.substring(0, 3)}</div>
                    {hours.map(h => {
                      const dayData = heatmap?.[day] || [];
                      const value = dayData[h] || 0;
                      const level = Math.min(Math.floor(value), 5);
                      return (
                        <div 
                          key={h} 
                          className={`heatmap-cell level-${level}`} 
                          title={`${day} ${h}:00 - ${value} Bookings`}
                        />
                      );
                    })}
                  </React.Fragment>
                ))}
              </div>
            </div>
            <div style={{ display: 'flex', gap: '12px', marginTop: '20px', fontSize: '0.75rem', fontWeight: 600, color: '#94a3b8', alignItems: 'center' }}>
              <span>Less</span>
              {[0,1,2,3,4,5].map(l => <div key={l} className={`heatmap-cell level-${l}`} style={{ width: '12px', height: '12px' }} />)}
              <span>More Active</span>
            </div>
          </div>

          {/* CAPACITY EFFICIENCY RADAR (LIST VIEW FOR PROFESSIONALISM) */}
          <div className="chart-card">
            <h3><Icons.Trends /> Capacity vs. Utilization Efficiency</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {Object.entries(efficiency).map(([name, rate]) => (
                <div key={name}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '0.875rem' }}>
                    <span style={{ fontWeight: 700, color: '#475569' }}>{name}</span>
                    <span style={{ fontWeight: 800, color: rate > 80 ? '#10b981' : '#6366f1' }}>{rate.toFixed(1)}%</span>
                  </div>
                  <div style={{ height: '8px', background: '#f1f5f9', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ 
                      height: '100%', 
                      background: rate > 80 ? 'var(--admin-accent-emerald)' : 'var(--admin-primary)',
                      width: `${rate}%`,
                      borderRadius: '4px',
                      transition: 'width 1s cubic-bezier(0.4, 0, 0.2, 1)' 
                    }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* NEW BOTTOM INSIGHTS GRID */}
          <div className="bottom-insights-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '24px' }}>
            <div className="chart-card" style={{ padding: '24px', marginBottom: 0 }}>
              <h3 style={{ marginBottom: '20px', fontSize: '1.1rem' }}><Icons.Alert /> Smart Insights</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {insights.length > 0 ? insights.map((insight, i) => (
                  <div key={i} className={`insight-card ${insight.severity.toLowerCase()}`}>
                    <span className="type">{insight.type}</span>
                    <p className="msg">{insight.message}</p>
                  </div>
                )) : (
                  <p style={{ color: '#94a3b8', fontSize: '0.875rem', textAlign: 'center', padding: '20px' }}>
                    No anomalies detected. Campus is performing at peak efficiency.
                  </p>
                )}
              </div>
            </div>

            <div className="chart-card" style={{ padding: '24px', background: 'var(--admin-secondary)', color: 'white', marginBottom: 0 }}>
              <h3 style={{ color: 'white', marginBottom: '16px' }}>Zone Distribution</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {Object.entries(locations).map(([loc, count]) => (
                  <div key={loc} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.875rem', fontWeight: 600, opacity: 0.8 }}>{loc}</span>
                    <span style={{ 
                      background: 'rgba(255,255,255,0.1)', 
                      padding: '2px 10px', 
                      borderRadius: '99px',
                      fontSize: '0.75rem',
                      fontWeight: 800
                    }}>{count} active</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>

      </div>
    </div>
  );
};

export default AdminDashboard;
