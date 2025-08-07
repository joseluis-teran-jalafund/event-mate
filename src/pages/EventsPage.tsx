import React from 'react';
import { useNavigate } from 'react-router';
import { useEvents } from '../features/events/hooks/useEvents';
import { EventCard } from '../components/organisms/EventCard';
import { Header } from '../components/organisms/Header';

export const EventsPage: React.FC = () => {
  const navigate = useNavigate();
  const { 
    events, 
    deleteEvent,
    isLoading, 
    isDeleting,
    isUpdating 
  } = useEvents();

  const handleEdit = (eventId: string) => {
    navigate(`/events/${eventId}/edit`);
  };

  const handleDelete = async (eventId: string) => {
    try {
      await deleteEvent(eventId);
    } catch (error) {
      console.error('Failed to delete event:', error);
      alert('Failed to delete event. Please try again.');
    }
  };

  const handleManageGuests = (eventId: string) => {
    navigate(`/events/${eventId}/invitations`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="Event Mate" />
      
      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        {isLoading ? (
          <div className="text-center py-8">Loading events...</div>
        ) : (
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Your Events</h2>
            </div>
            <div className="divide-y divide-gray-200">
              {events.length === 0 ? (
                <div className="px-4 py-5 sm:p-6 text-center">
                  <p className="text-gray-500">No events yet. Create your first event!</p>
                </div>
              ) : (
                events.map(event => (
                  <EventCard
                    key={event.eventId}
                    title={event.title}
                    featuredImage={event.featuredImage}
                    date={new Date(event.date).toLocaleDateString()}
                    description={event.description}
                    category={event.category}
                    onEdit={() => handleEdit(event.eventId!)}
                    onDelete={() => handleDelete(event.eventId!)}
                    onManageGuests={() => handleManageGuests(event.eventId!)}
                  />
                ))
              )}
            </div>
          </div>
        )}
        {(isDeleting || isUpdating) && (
          <div className="fixed inset-0 bg-white bg-opacity-30 flex items-center justify-center">
            <div className="bg-gray-200 p-4 rounded-lg">
              {isDeleting ? 'Deleting event...' : 'Updating event...'}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};