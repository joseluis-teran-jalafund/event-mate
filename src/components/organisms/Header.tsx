import React from 'react';
import { useNavigate } from 'react-router';
import { useAuthContext } from '../../providers/AuthProvider';
import { Button } from '../atoms/Button';
import { FiPlus, FiLogOut, FiBell, FiUser } from 'react-icons/fi';

interface HeaderProps {
  title: string;
}

export const Header: React.FC<HeaderProps> = ({ title }) => {
  const navigate = useNavigate();
  const { signOut, user } = useAuthContext();

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
        <h1 className="text-xl font-bold text-gray-900">{title}</h1>
        
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => navigate('/notifications')} 
            className="p-2 rounded-full hover:bg-gray-100"
            aria-label="Notifications"
          >
            <FiBell className="h-5 w-5 text-gray-600" />
          </button>

          {/* User Profile Icon */}
          <button 
            onClick={() => navigate('/profile')} 
            className="p-2 rounded-full hover:bg-gray-100"
            aria-label="User Profile"
          >
            <FiUser className="h-5 w-5 text-gray-600" />
          </button>

          {/* New Event Button */}
          <Button 
            variant="primary" 
            onClick={() => navigate('/events/new')}
            className="flex items-center gap-2"
          >
            <FiPlus />
            <span>New Event</span>
          </Button>

          {/* Sign Out Button */}
          <Button 
            variant="secondary" 
            onClick={signOut}
            className="flex items-center gap-2"
          >
            <FiLogOut />
            <span>Sign Out</span>
          </Button>
        </div>
      </div>
    </header>
  );
};
