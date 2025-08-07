import React from 'react';
import { useNavigate, useParams } from 'react-router';
import { EventForm } from '../components/organisms/EventForm';
import { useEvents } from '../features/events/hooks/useEvents';
import type { CreateEventRequest } from '../types/event/CreateEventRequest';

export const EditEventPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { events, updateEvent, isUpdating } = useEvents();
  
  const eventToEdit = events.find(event => event.eventId === id);

  const handleSubmit = async (data: CreateEventRequest) => {
    if (!id || !eventToEdit) return;
    
    try {
      const updateData = {
        ...data,
        date: data.date
      };
      
      await updateEvent(id, updateData);
      navigate('/events');
    } catch (error) {
      console.error('Error updating event:', error);
    }
  };

  if (!eventToEdit) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <p className="text-gray-700">Event not found</p>
          <button
            onClick={() => navigate('/events')}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Back to Events
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <h1 className="text-xl font-bold text-gray-900">Edit Event</h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="p-6">
            <EventForm 
              onSubmit={handleSubmit}
              defaultValues={{
                ...eventToEdit,
                date: eventToEdit.date
              }}
              isSubmitting={isUpdating}
              submitButtonText={isUpdating ? 'Saving...' : 'Save Changes'}
            />
          </div>
        </div>
      </main>
    </div>
  );
};
