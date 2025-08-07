import type { Guest } from "../guest/Guest";

export interface CreateEventRequest {
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  category: string;
  featuredImage?: string;
  ownerId: string;
  guests?: Guest[];
}
