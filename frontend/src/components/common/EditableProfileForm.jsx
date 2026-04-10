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
      <h3 className="profile-section-title">Edit Personal Details</h3>
      
      {error && <div className="form-message error">{error}</div>}

      <div className="profile-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        <div className="profile-form-group">
          <label htmlFor="name">Full Name</label>
          <input
            id="name"
            name="name"
            type="text"
            className="profile-form-input"
            value={formData.name}
            onChange={handleChange}
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
            placeholder="e.g. Computer Science"
          />
        </div>
      </div>

      <div className="profile-form-group" style={{ marginTop: '1.5rem' }}>
        <label htmlFor="bio">Bio</label>
        <textarea
          id="bio"
          name="bio"
          className="profile-form-input"
          value={formData.bio}
          onChange={handleChange}
          placeholder="Tell us a bit about yourself..."
          rows="4"
        />
      </div>

      <div className="profile-form-actions">
        <button type="button" onClick={onCancel} className="btn-secondary" disabled={loading}>
          Cancel
        </button>
        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </form>
  );
};

export default EditableProfileForm;
