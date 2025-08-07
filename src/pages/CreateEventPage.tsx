import React from 'react';
import { useNavigate } from 'react-router';
import { EventForm } from '../components/organisms/EventForm';
import { useEvents } from '../features/events/hooks/useEvents';
import type { CreateEventRequest } from '../types/event/CreateEventRequest';
import { useAuthContext } from '../providers/AuthProvider';
import { toast } from 'react-toastify';

export const CreateEventPage: React.FC = () => {
  const navigate = useNavigate();
  const { createEvent, isCreating } = useEvents();
  const { user } = useAuthContext();

  const handleSubmit = async (data: CreateEventRequest) => {
    if (!user) {
      toast.error('You must be logged in to create an event');
      return;
    }
    
    try {
      await createEvent({
        ...data,
        ownerId: user.uid
      });
      navigate('/events');
    } catch (error) {
      toast.error('Failed to create event');
      console.error('Failed to create event:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <h1 className="text-xl font-bold text-gray-900">Create New Event</h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="p-6">
            <EventForm 
              onSubmit={handleSubmit}
              isSubmitting={isCreating}
            />
          </div>
        </div>
      </main>
    </div>
  );
};
