"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { ChevronDownIcon } from "@heroicons/react/16/solid";
import { toast } from "sonner";
import Button from "@/components/button";
import {
  CITIES,
  createEventSchema,
  fieldErrorsFromZod,
  GENRES,
  type CreateEventInput,
  type EventFieldErrors,
  type PatchEventInput,
} from "@/lib/validations/events";
import type { Event } from "@/app/generated/prisma/client";




const inputClassName =
  "block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6";

const selectClassName =
  "col-start-1 row-start-1 w-full appearance-none rounded-md bg-white/5 py-1.5 pl-3 pr-8 text-base text-white outline outline-1 -outline-offset-1 outline-white/10 *:bg-gray-800 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6";

function fieldValue(formData: FormData, name: string) {
  const value = formData.get(name);
  return typeof value === "string" ? value : "";
}

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;

  return (
    <p id={id} className="mt-2 text-sm text-red-400">
      {message}
    </p>
  );
}

function toDateInputValue(value: Date | string) {
  const date = typeof value === "string" ? new Date(value) : value;
  return date.toISOString().slice(0, 10);
}

function toTimeInputValue(value: Date | string) {
  const date = typeof value === "string" ? new Date(value) : value;
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${hours}:${minutes}`;
}

function eventToFormValues(event: Event): CreateEventInput {
  return {
    eventName: event.name,
    genre: event.genre,
    capacity: event.capacity,
    description: event.description ?? undefined,
    eventCity: event.city,
    venue: event.venue,
    date: toDateInputValue(event.date),
    time: toTimeInputValue(event.time),
    contactName: event.contactName,
    phone: event.phone,
    email: event.email,
  };
}

function changedFields(
  initial: CreateEventInput,
  next: CreateEventInput,
): PatchEventInput {
  const patch: PatchEventInput = {};

  (Object.keys(next) as (keyof CreateEventInput)[]).forEach((key) => {
    const nextValue = next[key] ?? "";
    const initialValue = initial[key] ?? "";

    if (key === "time") {
      if (String(nextValue).slice(0, 5) !== String(initialValue).slice(0, 5)) {
        patch.time = next.time;
      }
      return;
    }

    if (nextValue !== initialValue) {
      (patch as CreateEventInput)[key] = next[key] as never;
    }
  });

  return patch;
}

export default function CreateEventForm({
  onClose,
  event,
}: {
  onClose: () => void;
  event?: Event | null;
}) {
  const router = useRouter();
  const [errors, setErrors] = useState<EventFieldErrors>({});
  const isEdit = Boolean(event);
  const defaults = event ? eventToFormValues(event) : undefined;

  async function handleSubmit(formEvent: FormEvent<HTMLFormElement>) {
    formEvent.preventDefault();

    const formData = new FormData(formEvent.currentTarget);
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

    const url = isEdit ? `/api/events/${event!.id}` : "/api/events";
    let body: CreateEventInput | PatchEventInput = result.data;

    if (isEdit && defaults) {
      body = changedFields(defaults, result.data);
      if (Object.keys(body).length === 0) {
        onClose();
        return;
      }
    }

    const response = await fetch(url, {
      method: isEdit ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => null);

      if (response.status === 400 && error?.fieldErrors) {
        setErrors(error.fieldErrors);
        return;
      }

      toast.error("Please try again later");
      return;
    }

    toast.success(
      isEdit ? "Event updated successfully" : "Event created successfully",
    );
    onClose();
    router.push("/events");
    router.refresh();
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="max-h-[85vh] w-[800px] max-w-full overflow-y-auto bg-gray-800/90  outline-1 -outline-offset-1 outline-white/10 sm:rounded-xl"
    >
      <div className="px-4 py-6 sm:p-8">
        <h2 className="text-base font-semibold text-white">
          {isEdit ? "Edit event" : "Create event"}
        </h2>
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
                defaultValue={defaults?.eventName ?? ""}
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
                defaultValue={defaults?.genre ?? ""}
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
                defaultValue={defaults?.capacity ?? ""}
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
                defaultValue={defaults?.description ?? ""}
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
                defaultValue={defaults?.eventCity ?? ""}
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
                defaultValue={defaults?.venue ?? ""}
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
                defaultValue={defaults?.date ?? ""}
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
                defaultValue={defaults?.time ?? ""}
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
                defaultValue={defaults?.contactName ?? ""}
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
                defaultValue={defaults?.phone ?? ""}
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
                defaultValue={defaults?.email ?? ""}
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
        <Button
          type="submit"
          label={isEdit ? "Save changes" : "Create event"}
          size="md"
        />
      </div>
    </form>
  );
}
