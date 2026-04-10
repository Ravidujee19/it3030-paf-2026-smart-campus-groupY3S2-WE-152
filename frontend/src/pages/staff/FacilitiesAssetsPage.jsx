import React, { useEffect, useState } from "react";
import resourceService from "../../services/resourceService";
import "../../styles/facilities.css";

const Icons = {
  MapPin: () => <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>,
  Users: () => <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/></svg>,
  Clock: () => <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>,
  Edit: () => <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>,
  Trash: () => <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>,
  Plus: () => <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/></svg>
};

export default function FacilitiesAssetsPage() {
  const [resources, setResources] = useState([]);
  const [filters, setFilters] = useState({ type: "", location: "", capacity: "" });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingResource, setEditingResource] = useState(null);

  const initialFormState = {
    name: "",
    type: "LECTURE_HALL",
    capacity: 10,
    location: "",
    availabilityWindows: "",
    status: "ACTIVE"
  };
  const [formData, setFormData] = useState(initialFormState);

  useEffect(() => {
    fetchResources();
  }, [filters]);

  const fetchResources = async () => {
    try {
      const data = await resourceService.getAllResources(filters);
      setResources(data);
    } catch (error) {
      console.error("Failed to fetch resources:", error);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const openModal = (resource = null) => {
    if (resource) {
      setEditingResource(resource);
      setFormData(resource);
    } else {
      setEditingResource(null);
      setFormData(initialFormState);
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingResource) {
        await resourceService.updateResource(editingResource.id, formData);
      } else {
        await resourceService.createResource(formData);
      }
      closeModal();
      fetchResources();
    } catch (error) {
      console.error("Failed to save resource", error);
      alert("Failed to save. Please check your inputs.");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this resource?")) {
      try {
        await resourceService.deleteResource(id);
        fetchResources();
      } catch (error) {
        console.error("Failed to delete", error);
      }
    }
  };

  const renderModal = () => {
    if (!isModalOpen) return null;

    return (
      <div className="modal-overlay" onClick={closeModal}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <h2 style={{marginTop: 0, marginBottom: '24px'}}>{editingResource ? 'Edit Resource' : 'Add New Resource'}</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Name</label>
              <input type="text" name="name" className="form-input" required value={formData.name} onChange={handleChange} placeholder="e.g. Main Auditorium"/>
            </div>
            
            <div style={{display: 'flex', gap: '16px', marginBottom: '20px'}}>
              <div style={{flex: 1}}>
                <label style={{display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#334155', marginBottom: '8px'}}>Type</label>
                <select name="type" className="form-select" value={formData.type} onChange={handleChange}>
                  <option value="LECTURE_HALL">Lecture Hall</option>
                  <option value="LAB">Lab</option>
                  <option value="MEETING_ROOM">Meeting Room</option>
                  <option value="EQUIPMENT">Equipment</option>
                </select>
              </div>
              <div style={{flex: 1}}>
                <label style={{display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#334155', marginBottom: '8px'}}>Status</label>
                <select name="status" className="form-select" value={formData.status} onChange={handleChange}>
                  <option value="ACTIVE">Active</option>
                  <option value="OUT_OF_SERVICE">Out of Service</option>
                </select>
              </div>
            </div>

            <div style={{display: 'flex', gap: '16px', marginBottom: '20px'}}>
              <div style={{flex: 1}}>
                <label style={{display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#334155', marginBottom: '8px'}}>Capacity</label>
                <input type="number" name="capacity" className="form-input" min="1" required value={formData.capacity} onChange={handleChange}/>
              </div>
              <div style={{flex: 1}}>
                <label style={{display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#334155', marginBottom: '8px'}}>Location</label>
                <input type="text" name="location" className="form-input" required value={formData.location} onChange={handleChange} placeholder="e.g. Block A"/>
              </div>
            </div>

            <div className="form-group">
              <label>Availability Windows</label>
              <input type="text" name="availabilityWindows" className="form-input" value={formData.availabilityWindows} onChange={handleChange} placeholder="e.g. 08:00 - 18:00 Weekdays"/>
            </div>

            <div className="modal-actions">
              <button type="button" className="btn-cancel" onClick={closeModal}>Cancel</button>
              <button type="submit" className="btn-save">{editingResource ? 'Update' : 'Save'}</button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  return (
    <div className="facilities-container">
      <header className="facilities-header">
        <div>
          <h1 className="facilities-title">Facilities & Assets</h1>
          <p style={{ color: '#64748b', margin: '4px 0 0 0' }}>Manage university bookable resources and equipment.</p>
        </div>
        <button className="btn-add-resource" onClick={() => openModal()}>
          <Icons.Plus /> Add Resource
        </button>
      </header>

      <div className="filters-bar">
        <select name="type" className="filter-select" onChange={handleFilterChange} value={filters.type}>
          <option value="">All Types</option>
          <option value="LECTURE_HALL">Lecture Hall</option>
          <option value="LAB">Lab</option>
          <option value="MEETING_ROOM">Meeting Room</option>
          <option value="EQUIPMENT">Equipment</option>
        </select>
        
        <input 
          type="text" 
          name="location" 
          className="filter-input" 
          placeholder="Filter by location..." 
          onChange={handleFilterChange} 
          value={filters.location}
        />
        
        <input 
          type="number" 
          name="capacity" 
          className="filter-input" 
          placeholder="Min capacity" 
          onChange={handleFilterChange} 
          value={filters.capacity}
          min="1"
        />
      </div>

      <div className="resources-grid">
        {resources.length === 0 ? (
          <div style={{gridColumn: '1 / -1', textAlign: 'center', padding: '60px', color: '#94a3b8'}}>
            <h3>No resources found.</h3>
          </div>
        ) : resources.map(resource => (
          <div className="resource-card" key={resource.id}>
            <div className="resource-header">
              <div>
                <h3 className="resource-name">{resource.name}</h3>
                <span className="resource-type">{resource.type.replace('_', ' ')}</span>
              </div>
              <span className={`status-badge ${resource.status === 'ACTIVE' ? 'status-active' : 'status-out'}`}>
                {resource.status.replace(/_/g, ' ')}
              </span>
            </div>

            <div className="resource-details">
              <div className="detail-item">
                <Icons.MapPin />
                <span>{resource.location}</span>
              </div>
              <div className="detail-item">
                <Icons.Users />
                <span>Capacity: {resource.capacity}</span>
              </div>
              {resource.availabilityWindows && (
                <div className="detail-item">
                  <Icons.Clock />
                  <span>{resource.availabilityWindows}</span>
                </div>
              )}
            </div>

            <div className="card-actions">
              <button className="btn-icon" onClick={() => openModal(resource)} title="Edit Resource">
                <Icons.Edit />
              </button>
              <button className="btn-icon delete" onClick={() => handleDelete(resource.id)} title="Delete Resource">
                <Icons.Trash />
              </button>
            </div>
          </div>
        ))}
      </div>

      {renderModal()}
    </div>
  );
}
