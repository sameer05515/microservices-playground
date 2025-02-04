import React from "react";

type AvatarProps = {
  username?: string;
  imageUrl?: string;
};

const Avatar: React.FC<AvatarProps> = ({ username, imageUrl }) => {
  const getInitials = (name: string) => name.slice(0, 2).toUpperCase();
  const displayText = username ? getInitials(username) : "??";

  return (
    <div className="flex items-center justify-center w-6 h-6 rounded-full bg-gray-300 text-white font-bold text-xs overflow-hidden">
      {imageUrl ? (
        <img src={imageUrl} alt={username || "Avatar"} className="w-full h-full object-cover" />
      ) : (
        <span>{displayText}</span>
      )}
    </div>
  );
};

export default Avatar;
