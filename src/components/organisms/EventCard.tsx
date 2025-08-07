import React from 'react';
import { Button } from '../atoms/Button';
import { FiEdit, FiTrash2, FiUsers } from 'react-icons/fi';
import { AdvancedImage } from '@cloudinary/react';
import cld from '../../services/cloudinary/CloudinaryConfig';

interface EventCardProps {
  title: string;
  date: string;
  description: string;
  category: string;
  featuredImage?: string;
  onEdit: () => void;
  onDelete: () => void;
  onManageGuests: () => void;
}

export const EventCard: React.FC<EventCardProps> = ({ 
  title, 
  date, 
  description, 
  category,
  featuredImage,
  onEdit, 
  onDelete,
  onManageGuests
}) => {
  return (
    <div className="p-4 hover:bg-gray-50 transition-colors">
      <div className="flex gap-4">
        {featuredImage && (
          <div className="flex-shrink-0">
            <AdvancedImage
              cldImg={cld.image(featuredImage).resize('scale', 120, 120)}
              className="h-30 w-30 object-cover rounded-md"
            />
          </div>
        )}
        
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-medium text-gray-900">{title}</h3>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-sm text-gray-500">{date}</span>
                <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                  {category}
                </span>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={onManageGuests}
                title="Manage Guests"
              >
                <FiUsers className="h-4 w-4" />
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={onEdit}
                title="Edit"
              >
                <FiEdit className="h-4 w-4" />
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={onDelete}
                title="Delete"
              >
                <FiTrash2 className="h-4 w-4 text-red-500" />
              </Button>
            </div>
          </div>
          <p className="mt-2 text-gray-600">{description}</p>
        </div>
      </div>
    </div>
  );
};
