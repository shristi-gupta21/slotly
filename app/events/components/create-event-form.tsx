"use client";

import { useState, type FormEvent } from "react";
import { ChevronDownIcon } from "@heroicons/react/16/solid";
import { flattenError, z } from "zod";
import Button from "@/components/button";

const GENRES = [
  "music",
  "comedy",
  "theatre",
  "sports",
  "workshop",
  "exhibition",
  "other",
] as const;

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

const createEventSchema = z.object({
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

type CreateEventInput = z.infer<typeof createEventSchema>;
type FieldErrors = Partial<Record<keyof CreateEventInput, string>>;

const inputClassName =
  "block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6";

const selectClassName =
  "col-start-1 row-start-1 w-full appearance-none rounded-md bg-white/5 py-1.5 pl-3 pr-8 text-base text-white outline outline-1 -outline-offset-1 outline-white/10 *:bg-gray-800 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6";

function fieldValue(formData: FormData, name: string) {
  const value = formData.get(name);
  return typeof value === "string" ? value : "";
}

function fieldErrorsFromZod(error: z.ZodError): FieldErrors {
  const { fieldErrors } = flattenError(error);
  const next: FieldErrors = {};

  for (const [key, messages] of Object.entries(fieldErrors)) {
    if (Array.isArray(messages) && messages[0]) {
      next[key as keyof CreateEventInput] = messages[0];
    }
  }

  return next;
}

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;

  return (
    <p id={id} className="mt-2 text-sm text-red-400">
      {message}
    </p>
  );
}

export default function CreateEventForm() {
  const [errors, setErrors] = useState<FieldErrors>({});

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const result = createEventSchema.safeParse({
      eventName: fieldValue(formData, "eventName"),
      genre: fieldValue(formData, "genre"),
      capacity: fieldValue(formData, "capacity"),
      description: fieldValue(formData, "description"),
      eventCity: fieldValue(formData, "eventCity"),
      venue: fieldValue(formData, "venue"),
      date: fieldValue(formData, "date"),
      time: fieldValue(formData, "time"),
      contactName: fieldValue(formData, "contactName"),
      phone: fieldValue(formData, "phone"),
      email: fieldValue(formData, "email"),
    });

    if (!result.success) {
      setErrors(fieldErrorsFromZod(result.error));
      return;
    }

    setErrors({});
    console.log(result.data);
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="max-h-[85vh] w-[800px] max-w-full overflow-y-auto bg-gray-800/50  outline-1 -outline-offset-1 outline-white/10 sm:rounded-xl"
    >
      <div className="px-4 py-6 sm:p-8">
        <h2 className="text-base font-semibold text-white">Create event</h2>
        <div className="mt-6 grid max-w-3xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
          <div className="col-span-full">
            <label
              htmlFor="eventName"
              className="block text-sm/6 font-medium text-white"
            >
              Event name
            </label>
            <div className="mt-2">
              <input
                id="eventName"
                name="eventName"
                type="text"
                aria-invalid={Boolean(errors.eventName)}
                aria-describedby={
                  errors.eventName ? "eventName-error" : undefined
                }
                className={inputClassName}
              />
            </div>
            <FieldError id="eventName-error" message={errors.eventName} />
          </div>

          <div className="sm:col-span-3">
            <label
              htmlFor="genre"
              className="block text-sm/6 font-medium text-white"
            >
              Genre
            </label>
            <div className="mt-2 grid grid-cols-1">
              <select
                id="genre"
                name="genre"
                defaultValue=""
                aria-invalid={Boolean(errors.genre)}
                aria-describedby={errors.genre ? "genre-error" : undefined}
                className={selectClassName}
              >
                <option value="">Select genre</option>
                {GENRES.map((genre) => (
                  <option key={genre} value={genre}>
                    {genre.charAt(0).toUpperCase() + genre.slice(1)}
                  </option>
                ))}
              </select>
              <ChevronDownIcon
                aria-hidden="true"
                className="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end text-gray-400 sm:size-4"
              />
            </div>
            <FieldError id="genre-error" message={errors.genre} />
          </div>

          <div className="sm:col-span-3">
            <label
              htmlFor="capacity"
              className="block text-sm/6 font-medium text-white"
            >
              Capacity
            </label>
            <div className="mt-2">
              <input
                id="capacity"
                name="capacity"
                type="number"
                min={1}
                inputMode="numeric"
                aria-invalid={Boolean(errors.capacity)}
                aria-describedby={
                  errors.capacity ? "capacity-error" : undefined
                }
                className={inputClassName}
              />
            </div>
            <FieldError id="capacity-error" message={errors.capacity} />
          </div>

          <div className="col-span-full">
            <label
              htmlFor="description"
              className="block text-sm/6 font-medium text-white"
            >
              Description
            </label>
            <div className="mt-2">
              <textarea
                id="description"
                name="description"
                rows={3}
                className={inputClassName}
              />
            </div>
          </div>

          <div className="sm:col-span-3">
            <label
              htmlFor="eventCity"
              className="block text-sm/6 font-medium text-white"
            >
              Event city
            </label>
            <div className="mt-2 grid grid-cols-1">
              <select
                id="eventCity"
                name="eventCity"
                defaultValue=""
                aria-invalid={Boolean(errors.eventCity)}
                aria-describedby={
                  errors.eventCity ? "eventCity-error" : undefined
                }
                className={selectClassName}
              >
                <option value="">Select city</option>
                {CITIES.map((city) => (
                  <option key={city} value={city}>
                    {city.charAt(0).toUpperCase() + city.slice(1)}
                  </option>
                ))}
              </select>
              <ChevronDownIcon
                aria-hidden="true"
                className="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end text-gray-400 sm:size-4"
              />
            </div>
            <FieldError id="eventCity-error" message={errors.eventCity} />
          </div>

          <div className="sm:col-span-3">
            <label
              htmlFor="venue"
              className="block text-sm/6 font-medium text-white"
            >
              Venue
            </label>
            <div className="mt-2">
              <input
                id="venue"
                name="venue"
                type="text"
                aria-invalid={Boolean(errors.venue)}
                aria-describedby={errors.venue ? "venue-error" : undefined}
                className={inputClassName}
              />
            </div>
            <FieldError id="venue-error" message={errors.venue} />
          </div>

          <div className="sm:col-span-3">
            <label
              htmlFor="date"
              className="block text-sm/6 font-medium text-white"
            >
              Date
            </label>
            <div className="mt-2">
              <input
                id="date"
                name="date"
                type="date"
                aria-invalid={Boolean(errors.date)}
                aria-describedby={errors.date ? "date-error" : undefined}
                className={inputClassName}
              />
            </div>
            <FieldError id="date-error" message={errors.date} />
          </div>

          <div className="sm:col-span-3">
            <label
              htmlFor="time"
              className="block text-sm/6 font-medium text-white"
            >
              Time
            </label>
            <div className="mt-2">
              <input
                id="time"
                name="time"
                type="time"
                aria-invalid={Boolean(errors.time)}
                aria-describedby={errors.time ? "time-error" : undefined}
                className={inputClassName}
              />
            </div>
            <FieldError id="time-error" message={errors.time} />
          </div>

          <div className="sm:col-span-3">
            <label
              htmlFor="contactName"
              className="block text-sm/6 font-medium text-white"
            >
              Contact name
            </label>
            <div className="mt-2">
              <input
                id="contactName"
                name="contactName"
                type="text"
                autoComplete="name"
                aria-invalid={Boolean(errors.contactName)}
                aria-describedby={
                  errors.contactName ? "contactName-error" : undefined
                }
                className={inputClassName}
              />
            </div>
            <FieldError id="contactName-error" message={errors.contactName} />
          </div>

          <div className="sm:col-span-3">
            <label
              htmlFor="phone"
              className="block text-sm/6 font-medium text-white"
            >
              Phone number
            </label>
            <div className="mt-2">
              <input
                id="phone"
                name="phone"
                type="tel"
                autoComplete="tel"
                aria-invalid={Boolean(errors.phone)}
                aria-describedby={errors.phone ? "phone-error" : undefined}
                className={inputClassName}
              />
            </div>
            <FieldError id="phone-error" message={errors.phone} />
          </div>

          <div className="col-span-full">
            <label
              htmlFor="email"
              className="block text-sm/6 font-medium text-white"
            >
              Email
            </label>
            <div className="mt-2">
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                aria-invalid={Boolean(errors.email)}
                aria-describedby={errors.email ? "email-error" : undefined}
                className={inputClassName}
              />
            </div>
            <FieldError id="email-error" message={errors.email} />
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end gap-x-4 border-t border-white/10 px-4 py-4 sm:px-8">
        <Button type="submit" label="Create event" size="md" />
      </div>
    </form>
  );
}
