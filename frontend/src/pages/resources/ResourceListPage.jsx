import React, { useState, useEffect } from 'react';
import resourceService from '../../services/resourceService';
import ResourceCard from './components/ResourceCard';
import ResourceModal from './components/ResourceModal';
import './ResourceListPage.css';

const ResourceListPage = ({ refreshTrigger, hideHeader = false }) => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    type: '',
    capacity: '',
    location: '',
  });

  // Edit Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedResource, setSelectedResource] = useState(null);

  useEffect(() => {
    fetchResources();
  }, [filters, refreshTrigger]);

  const fetchResources = async () => {
    setLoading(true);
    try {
      const data = await resourceService.getAllResources(filters);
      setResources(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch resources. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await resourceService.deleteResource(id);
      setResources((prev) => prev.filter((r) => r.id !== id));
    } catch (err) {
      alert('Failed to delete resource. Please try again.');
    }
  };

  const handleEdit = (resource) => {
    setSelectedResource(resource);
    setIsEditModalOpen(true);
  };

  const handleUpdateSuccess = () => {
    fetchResources();
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="resource-page">
      {!hideHeader && (
        <header className="resource-header">
          <h1>Facilities & Assets Catalogue</h1>
          <p>Explore and book resources across the Smart Campus.</p>
        </header>
      )}

      <section className="filter-section">
        <div className="filter-grid">
          <div className="filter-group">
            <label htmlFor="type">Resource Category</label>
            <div className="input-with-icon">
              <span className="filter-icon">
                <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
              </span>
              <select name="type" id="type" value={filters.type} onChange={handleFilterChange}>
                <option value="">All Categories</option>
                <option value="LECTURE_HALL">Lecture Halls</option>
                <option value="LAB">Research Labs</option>
                <option value="MEETING_ROOM">Meeting Rooms</option>
                <option value="EQUIPMENT">Specialized Equipment</option>
              </select>
            </div>
          </div>
          
          <div className="filter-group">
            <label htmlFor="capacity">Minimum Capacity</label>
            <div className="input-with-icon">
              <span className="filter-icon">
                <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
              </span>
              <input
                type="number"
                name="capacity"
                id="capacity"
                placeholder="e.g. 50"
                value={filters.capacity}
                onChange={handleFilterChange}
              />
            </div>
          </div>
          
          <div className="filter-group">
            <label htmlFor="location">Facility Location</label>
            <div className="input-with-icon">
              <span className="filter-icon">
                <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              </span>
              <input
                type="text"
                name="location"
                id="location"
                placeholder="Search by building name..."
                value={filters.location}
                onChange={handleFilterChange}
              />
            </div>
          </div>

          <button 
            className="clear-filters-btn" 
            onClick={() => setFilters({ type: '', capacity: '', location: '' })}
            title="Reset all filters"
          >
            <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
            Reset
          </button>
        </div>
      </section>

      {loading ? (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading catalogue...</p>
        </div>
      ) : error ? (
        <div className="error-container">
          <p>{error}</p>
          <button onClick={fetchResources} className="retry-btn">Retry</button>
        </div>
      ) : (
        <div className="resource-grid">
          {resources.length > 0 ? (
            resources.map((resource) => (
              <ResourceCard 
                key={resource.id} 
                resource={resource} 
                onDelete={handleDelete}
                onEdit={() => handleEdit(resource)}
              />
            ))
          ) : (
            <div className="no-results">
              <h3>No resources found matching your filters.</h3>
              <p>Try adjusting your search criteria.</p>
            </div>
          )}
        </div>
      )}

      {/* Edit Modal */}
      <ResourceModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedResource(null);
        }}
        onSuccess={handleUpdateSuccess}
        initialData={selectedResource}
        mode="EDIT"
      />
    </div>
  );
};

export default ResourceListPage;
