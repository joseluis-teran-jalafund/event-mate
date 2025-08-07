import type { Guest } from "../guest/Guest";

export interface Event {
  eventId?: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  category: string;
  featuredImage?: string;
  ownerId: string;
  createdAt: Date;
}

export interface EventWithId extends Event {
  eventId: string;
  guests?: Guest[];
}
