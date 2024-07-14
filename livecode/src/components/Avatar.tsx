import React, { useState } from 'react';

interface AvatarProps {
  imageSrc?: string;
  status?: boolean;
  username: string;
  email?: string;
  options?: { label: string; href: string }[];
  isOwner?:boolean;
  
}

const Avatar: React.FC<AvatarProps> = ({ imageSrc, status, username, email, options,}) => {
  const [isImageLoaded, setIsImageLoaded] = useState(true);
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const handleImageError = () => {
    setIsImageLoaded(false);
  };

  const getInitials = (fullName: string) => {
    const nameParts = fullName?.split(' ');
    const initials = nameParts?.map(part => part[0]).join('');
    return initials?.toUpperCase() || 'O';
  };

  return (
    <div className="relative inline-block text-left">
      <div className="relative">
        {isImageLoaded && imageSrc ? (
          <img
            id="avatarButton"
            className="w-10 h-10 rounded-full cursor-pointer"
            src={imageSrc}
            alt="User avatar"
            onClick={() => setDropdownOpen(!isDropdownOpen)}
            onError={handleImageError}
          />
        ) : (
          <span
            id="avatarButton"
            className="w-10 h-10 rounded-full flex items-center justify-center bg-gray-300 text-gray-600 dark:bg-gray-700 dark:text-gray-300 cursor-pointer font-medium text-lg"
            onClick={() => setDropdownOpen(!isDropdownOpen)}
          >
            {getInitials(username)}
          </span>
        )}
        <span
          className={`absolute bottom-0 left-7 w-3.5 h-3.5 rounded-full border-2 border-white dark:border-gray-800 ${
            status ? 'bg-green-400' : 'bg-gray-400'
          }`}
        ></span>
      </div>
      
      {isDropdownOpen && (
        <div
          id="userDropdown"
          className="z-10 absolute right-0 mt-2 bg-white divide-y divide-gray-100 rounded-lg shadow-lg w-44 dark:bg-gray-700 dark:divide-gray-600"
        >
          <div className="px-4 py-3 text-sm text-gray-900 dark:text-white">
            <div>{username}</div>
            <div className="font-medium truncate">{email}</div>
          </div>
          <ul className="py-2 text-sm text-gray-700 dark:text-gray-200">
            {options?.map((option, index) => (
              <li key={index}>
                <a
                  href={option.href}
                  className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                >
                  {option.label}
                </a>
              </li>
            ))}
          </ul>
          <div className="py-1">
            <a
              href="#"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
            >
                Remove
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default Avatar;
