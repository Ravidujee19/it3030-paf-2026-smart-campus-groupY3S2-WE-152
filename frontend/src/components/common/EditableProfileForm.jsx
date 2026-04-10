import { useState } from "react";
import "../../styles/profile.css";

const EditableProfileForm = ({ user, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    department: user?.department || "",
    bio: user?.bio || "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await onSave(formData);
    } catch (err) {
      console.error(err);
      setError("Failed to update profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="profile-section">
      <h3 className="profile-section-title">
        <svg style={{width:'20px', height:'20px', color: 'var(--admin-primary)'}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
        </svg>
        Edit Personal Details
      </h3>
      
      {error && <div className="profile-alert error">{error}</div>}

      <div className="profile-grid">
        <div className="profile-form-group">
          <label htmlFor="name">Full Name</label>
          <input
            id="name"
            name="name"
            type="text"
            className="profile-form-input"
            value={formData.name}
            onChange={handleChange}
            placeholder="Your full name"
            required
          />
        </div>

        <div className="profile-form-group">
          <label htmlFor="phone">Phone Number</label>
          <input
            id="phone"
            name="phone"
            type="tel"
            className="profile-form-input"
            value={formData.phone}
            onChange={handleChange}
            placeholder="e.g. +1 234 567 890"
          />
        </div>

        <div className="profile-form-group">
          <label htmlFor="department">Department</label>
          <input
            id="department"
            name="department"
            type="text"
            className="profile-form-input"
            value={formData.department}
            onChange={handleChange}
            placeholder="e.g. Engineering"
          />
        </div>

        <div className="profile-form-group">
          <label htmlFor="email">Email Address (Read-only)</label>
          <input
            id="email"
            type="email"
            className="profile-form-input"
            value={user.email}
            disabled
          />
        </div>
      </div>

      <div className="profile-form-group" style={{ marginTop: '8px' }}>
        <label htmlFor="bio">Professional Bio</label>
        <textarea
          id="bio"
          name="bio"
          className="profile-form-input"
          value={formData.bio}
          onChange={handleChange}
          placeholder="A brief description of your professional background..."
        />
      </div>

      <div className="profile-form-actions">
        <button type="button" onClick={onCancel} className="profile-nav-btn" disabled={loading}>
          Discard Changes
        </button>
        <button type="submit" className="admin-btn-primary" disabled={loading} style={{ minWidth: '140px' }}>
          {loading ? "Optimizing..." : "Save Profile"}
        </button>
      </div>
    </form>
  );
};

export default EditableProfileForm;
