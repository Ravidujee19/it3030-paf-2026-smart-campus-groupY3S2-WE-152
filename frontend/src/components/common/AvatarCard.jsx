import { useState } from "react";
import defaultAvatar from "../../assets/default-avatar.svg";

const AvatarCard = ({ src, alt, size = "md", style }) => {
  const [imageError, setImageError] = useState(false);

  const getDimensions = () => {
    switch (size) {
      case "sm": return { width: "32px", height: "32px", fontSize: "1rem" };
      case "lg": return { width: "120px", height: "120px", fontSize: "3rem" };
      case "md":
      default: return { width: "40px", height: "40px", fontSize: "1.2rem" };
    }
  };

  const dimensions = getDimensions();

  if (!src || imageError) {
    if (alt && alt !== "Profile") {
      const initial = alt.charAt(0).toUpperCase();
      return (
        <div 
          className="admin-avatar" 
          style={{ 
            ...dimensions, 
            ...style, 
            boxSizing: 'border-box' 
          }}
          title={alt}
        >
          {initial}
        </div>
      );
    }
    
    return (
      <div 
        style={{ 
          ...dimensions, 
          borderRadius: "50%", 
          backgroundColor: "#cbd5e1", 
          display: "flex", 
          alignItems: "center", 
          justifyContent: "center", 
          ...style,
          boxSizing: 'border-box',
          overflow: "hidden"
        }}
        title="Default Avatar"
      >
        <img 
          src={defaultAvatar} 
          alt="Default Avatar" 
          style={{ width: "60%", height: "60%", opacity: 0.8 }} 
        />
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt || "User Avatar"}
      onError={() => setImageError(true)}
      style={{
        ...dimensions,
        borderRadius: "50%",
        objectFit: "cover",
        border: size === "lg" ? "4px solid white" : "2px solid white",
        boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
        boxSizing: "border-box",
        ...style
      }}
    />
  );
};

export default AvatarCard;
