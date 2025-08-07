import { useState, useEffect } from 'react';
import { useAuthContext } from '../../../providers/AuthProvider';
import { doc, collection, addDoc, deleteDoc, getDocs, query, where } from 'firebase/firestore';
import { firebaseDb } from '../../../services/firebase/FirebaseConfig';
import type { Event, EventWithId } from '../../../types/event/Event';
import type { CreateEventRequest } from '../../../types/event/CreateEventRequest';
import { writeBatch } from 'firebase/firestore';

export const useEvents = () => {
  const { user } = useAuthContext();
  const [events, setEvents] = useState<EventWithId[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchEvents = async () => {
      if (!user) return;
      
      setIsLoading(true);
      try {
        const q = query(
          collection(firebaseDb, 'events'),
          where('ownerId', '==', user.uid)
        );
        const querySnapshot = await getDocs(q);
        const eventsData: EventWithId[] = [];
        querySnapshot.forEach((doc) => {
          eventsData.push({ ...doc.data() as Event, eventId: doc.id });
        });
        setEvents(eventsData);
      } catch (error) {
        console.error('Error fetching events:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, [user]);

  const createEvent = async (data: CreateEventRequest) => {
    if (!user) return;
    
    setIsCreating(true);
    try {
      const eventData = {
        ...data,
        ownerId: user.uid,
        createdAt: new Date(),
        guestEmails: data.guests || []
      };
      
      const docRef = await addDoc(collection(firebaseDb, 'events'), eventData);
      
      if (data.guests?.length) {
        const batch = writeBatch(firebaseDb);
        data.guests.forEach(email => {
          const inviteRef = doc(collection(firebaseDb, `events/${docRef.id}/invitations`));
          batch.set(inviteRef, { email });
        });
        try {
          await batch.commit();
        } catch (error) {
          console.error('Error writing invitations:', error);
          // Optionally delete the event if invitations fail
          await deleteDoc(doc(firebaseDb, 'events', docRef.id));
          throw new Error('Failed to create invitations');
        }
      }

      setEvents(prev => [...prev, { 
        ...eventData, 
        eventId: docRef.id
      }]);
    } catch (error) {
      console.error('Error creating event:', error);
      throw error;
    } finally {
      setIsCreating(false);
    }
  };

  const updateEvent = async (eventId: string, updatedData: Partial<Event>) => {
  if (!user) return;

  setIsUpdating(true);
  try {
    const eventRef = doc(firebaseDb, 'events', eventId);
    const batch = writeBatch(firebaseDb);

    // Update the main event document
    batch.update(eventRef, updatedData);

    // If guests were updated, handle the invitations subcollection
    if (updatedData.guestEmails) {
      // First, clear existing invitations
      const invitationsRef = collection(firebaseDb, `events/${eventId}/invitations`);
      const invitationsSnapshot = await getDocs(invitationsRef);
      invitationsSnapshot.forEach(doc => {
        batch.delete(doc.ref);
      });

      // Then add new invitations
      updatedData.guestEmails.forEach(email => {
        const inviteRef = doc(invitationsRef);
        batch.set(inviteRef, { email });
      });
    }

    await batch.commit();

    setEvents(prev => prev.map(event => 
      event.eventId === eventId 
        ? { ...event, ...updatedData } 
        : event
    ));
  } catch (error) {
    console.error('Error updating event:', error);
    throw error;
  } finally {
    setIsUpdating(false);
  }
};

const deleteEvent = async (eventId: string) => {
  if (!user) return;

  setIsDeleting(true);
  try {
    // First delete all invitations/subcollections
    const invitationsRef = collection(firebaseDb, `events/${eventId}/invitations`);
    const invitationsSnapshot = await getDocs(invitationsRef);
    const batch = writeBatch(firebaseDb);
    
    invitationsSnapshot.forEach(doc => {
      batch.delete(doc.ref);
    });
    
    // Then delete the event itself
    batch.delete(doc(firebaseDb, 'events', eventId));
    
    await batch.commit();

    setEvents(prev => prev.filter(event => event.eventId !== eventId));
  } catch (error) {
    console.error('Error deleting event:', error);
    throw error;
  } finally {
    setIsDeleting(false);
  }
};

  const addGuest = async (eventId: string, email: string) => {
  try {
    const event = events.find(e => e.eventId === eventId);
    if (!event || (event.guests ?? []).some(g => g.email === email)) return;

    // Only store email in invitations collection
    await addDoc(collection(firebaseDb, `events/${eventId}/invitations`), { 
      email // Just the email string
    });

    // But still update local state with full object
    setEvents(prev => prev.map(ev => 
      ev.eventId === eventId 
        ? { ...ev, guests: [...(ev.guests ?? []), { email, status: 'pending', invitedAt: new Date() }] }
        : ev
    ));
  } catch (error) {
    console.error('Error adding guest:', error);
  }
};

  const removeGuest = async (eventId: string, email: string) => {
  try {
    const guestQuery = query(
      collection(firebaseDb, `events/${eventId}/guests`),
      where('email', '==', email)
    );
    const guestSnapshot = await getDocs(guestQuery);
    guestSnapshot.forEach(async (doc) => {
      await deleteDoc(doc.ref);
    });

    setEvents(prev => prev.map(ev =>
      ev.eventId === eventId
        ? { ...ev, guests: (ev.guests ?? []).filter(g => g.email !== email) }
        : ev
    ));
  } catch (error) {
    console.error('Error removing guest:', error);
  }
};

  // ... other functions (updateEvent, deleteEvent) remain unchanged

  return {
    events,
    isLoading,
    isCreating,
    isUpdating,
    isDeleting,
    createEvent,
    updateEvent,
    deleteEvent,   
    addGuest,
    removeGuest
  };
};
