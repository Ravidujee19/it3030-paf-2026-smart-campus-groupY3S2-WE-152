import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { updateProfile } from "../../services/userService";
import ProfileHeader from "../../components/common/ProfileHeader";
import EditableProfileForm from "../../components/common/EditableProfileForm";
import "../../styles/profile.css";

function ProfilePage() {
  const { user, refreshUser } = useAuth();
  const navigate = useNavigate();
  const [successMessage, setSuccessMessage] = useState("");

  const handleSaveProfile = async (formData) => {
    try {
      await updateProfile(formData);
      await refreshUser(); 
      setSuccessMessage("Profile updated successfully!");
      // Clear message after 3 seconds
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      throw error; 
    }
  };

  const handleGoBack = () => {
    if (user?.role === "ADMIN") navigate("/admin");
    else if (user?.role === "STAFF") navigate("/staff");
    else if (user?.role === "TECHNICIAN") navigate("/technician");
    else navigate("/home");
  };

  if (!user) {
    return <div style={{ padding: "2rem", textAlign: "center" }}>Loading profile...</div>;
  }

  return (
    <div className="profile-container">
      <div style={{ marginBottom: "2rem" }}>
        <button 
          onClick={handleGoBack} 
          className="profile-nav-btn"
        >
          <svg style={{width:'18px', height:'18px'}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
          </svg>
          Return to Dashboard
        </button>
      </div>

      {successMessage && (
        <div className="profile-alert success">
          <svg style={{width:'20px', height:'20px'}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          {successMessage}
        </div>
      )}

      <ProfileHeader user={user} />
      
      <EditableProfileForm 
        user={user} 
        onSave={handleSaveProfile} 
        onCancel={handleGoBack} 
      />
    </div>
  );
}

export default ProfilePage;