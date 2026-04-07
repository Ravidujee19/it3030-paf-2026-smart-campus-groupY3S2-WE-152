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
}

export default ResourceListPage;
