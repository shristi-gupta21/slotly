"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { Event } from "@/app/generated/prisma/client";
import Card from "./card";
import CreateEventForm from "./create-event-form";
import Modal from "@/components/modal";

const EventList = ({ events }: { events: Event[] }) => {
  const router = useRouter();
  const [eventToEdit, setEventToEdit] = useState<Event | null>(null);

  const handleDelete = async (id: string) => {
    const result = await fetch(`/api/events/${id}`, {
      method: "DELETE",
    });

    if (result.ok) {
      toast.success("Event deleted successfully");
      router.refresh();
    } else {
      toast.error("Failed to delete event");
    }
  };

  const handleEdit = (event: Event) => {
    setEventToEdit(event);
  };

  return (
    <div>
      <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {events.map((event: Event) => (
          <Card
            key={event.id}
            event={event}
            onDelete={handleDelete}
            onEdit={handleEdit}
          />
        ))}
      </ul>
      {eventToEdit && (
        <Modal open onClose={() => setEventToEdit(null)}>
          <CreateEventForm
            key={eventToEdit.id}
            event={eventToEdit}
            onClose={() => setEventToEdit(null)}
          />
        </Modal>
      )}
    </div>
  );
};

export default EventList;
