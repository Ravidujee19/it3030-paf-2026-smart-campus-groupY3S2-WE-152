import AvatarCard from "./AvatarCard";
import "../../styles/profile.css";

const ProfileHeader = ({ user }) => {
  if (!user) return null;

  return (
    <div className="profile-header-card">
      <div className="profile-avatar-container">
        <AvatarCard 
          src={user.profilePicture} 
          alt={user.name} 
          size="lg" 
        />
      </div>
      
      <div className="profile-info">
        <div className="profile-role-badge">{user.role || 'User'}</div>
        <h1 className="profile-name">{user.name || 'User'}</h1>
        
        <div className="profile-email">
          <svg style={{width:'18px', height:'18px'}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
          </svg>
          {user.email || 'No Email Available'}
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
