import { flattenError, z } from "zod";

export const createBookingSchema = z.object({
  eventId: z.string().uuid("Invalid event ID"),
  seats: z.coerce.number().int().positive("Seats must be at least 1"),
  attendeeName: z.string().trim().min(1, "Attendee name is required"),
  attendeeEmail: z.email("Invalid email address"),
});

export type CreateBookingInput = z.infer<typeof createBookingSchema>;
export type BookingFieldErrors = Partial<
  Record<keyof CreateBookingInput, string>
>;

export function fieldErrorsFromZod(error: z.ZodError): BookingFieldErrors {
  const { fieldErrors } = flattenError(error);
  const next: BookingFieldErrors = {};

  for (const [key, messages] of Object.entries(fieldErrors)) {
    if (Array.isArray(messages) && messages[0]) {
      next[key as keyof CreateBookingInput] = messages[0];
    }
  }

  return next;
}
