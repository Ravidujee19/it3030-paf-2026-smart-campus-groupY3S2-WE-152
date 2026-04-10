import AvatarCard from "./AvatarCard";
import "../../styles/profile.css";

const ProfileHeader = ({ user }) => {
  if (!user) return null;

  return (
    <div className="profile-header-card">
      <div className="profile-avatar-container">
        <div className="profile-avatar-wrapper">
          {user.profilePicture ? (
            <img 
              src={user.profilePicture} 
              alt={user.name} 
              style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
            />
          ) : (
            (user.name || "U").charAt(0).toUpperCase()
          )}
        </div>
      </div>
      
      <div className="profile-info">
        <div className="profile-role-badge">
          <svg style={{width:'14px', height:'14px', marginRight: '6px'}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
          </svg>
          {user.role || 'User'}
        </div>
        <h1 className="profile-name">{user.name || 'Anonymous User'}</h1>
        
        <div className="profile-email">
          <svg style={{width:'18px', height:'18px', color: 'var(--admin-primary)'}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
          </svg>
          {user.email}
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
