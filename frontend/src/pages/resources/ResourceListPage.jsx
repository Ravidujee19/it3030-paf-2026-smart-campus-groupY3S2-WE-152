import React, { useState, useEffect } from 'react';
import resourceService from '../../services/resourceService';
import ResourceCard from './components/ResourceCard';
import './ResourceListPage.css';

const ResourceListPage = () => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    type: '',
    capacity: '',
    location: '',
  });

  useEffect(() => {
    fetchResources();
  }, [filters]);

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

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="resource-page">
      <header className="resource-header">
        <h1>Facilities & Assets Catalogue</h1>
        <p>Explore and book resources across the Smart Campus.</p>
      </header>

      <section className="filter-section">
        <div className="filter-grid">
          <div className="filter-group">
            <label htmlFor="type">Resource Type</label>
            <select name="type" id="type" value={filters.type} onChange={handleFilterChange}>
              <option value="">All Types</option>
              <option value="LECTURE_HALL">Lecture Hall</option>
              <option value="LAB">Lab</option>
              <option value="MEETING_ROOM">Meeting Room</option>
              <option value="EQUIPMENT">Equipment</option>
            </select>
          </div>
          <div className="filter-group">
            <label htmlFor="capacity">Min Capacity</label>
            <input
              type="number"
              name="capacity"
              id="capacity"
              placeholder="e.g. 20"
              value={filters.capacity}
              onChange={handleFilterChange}
            />
          </div>
          <div className="filter-group">
            <label htmlFor="location">Location</label>
            <input
              type="text"
              name="location"
              id="location"
              placeholder="Search by building..."
              value={filters.location}
              onChange={handleFilterChange}
            />
          </div>
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
              <ResourceCard key={resource.id} resource={resource} />
            ))
          ) : (
            <div className="no-results">
              <h3>No resources found matching your filters.</h3>
              <p>Try adjusting your search criteria.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ResourceListPage;
