import { z } from "zod";

export const  GENRES = [
    "music",
    "comedy",
    "theatre",
    "sports",
    "workshop",
    "exhibition",
    "other",
  ] as const;
export 
const CITIES = [
  "delhi",
  "mumbai",
  "bengaluru",
  "hyderabad",
  "chennai",
  "kolkata",
  "pune",
  "jaipur",
  "other",
] as const;

export const createEventSchema = z.object({
    eventName: z.string().trim().min(1, "Event name is required"),
    genre: z.enum(GENRES, { error: "Select a genre" }),
    capacity: z.coerce.number().int().positive("Capacity must be at least 1"),
    description: z.string().trim().optional(),
    eventCity: z.enum(CITIES, { error: "Select a city" }),
    venue: z.string().trim().min(1, "Venue is required"),
    date: z.iso.date({ error: "Select a date" }),
    time: z.iso.time({ error: "Select a time" }),
    contactName: z.string().trim().min(1, "Contact name is required"),
    phone: z
      .string()
      .trim()
      .transform((value) => value.replace(/[\s-]/g, ""))
      .pipe(z.string().regex(/^\+?\d{10,15}$/, "Enter a valid phone number")),
    email: z.email("Enter a valid email"),
  });

  
export const patchEventSchema = createEventSchema.partial();

export type CreateEventInput = z.infer<typeof createEventSchema>;
export type PatchEventInput = z.infer<typeof patchEventSchema>;
export type EventFieldErrors = Partial<Record<keyof CreateEventInput, string>>;