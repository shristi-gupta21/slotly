"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { Event } from "@/app/generated/prisma/client";
import Card from "./card";
import CreateEventForm from "./create-event-form";
import Modal from "@/components/modal";
import Button from "@/components/button";

const EventList = ({ events }: { events: Event[] }) => {
  const router = useRouter();
  const [eventToEdit, setEventToEdit] = useState<Event | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const closeModal = () => {
    setEventToEdit(null);
    setShowCreateModal(false);
  };

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
    setShowCreateModal(false);
    setEventToEdit(event);
  };

  const isModalOpen = showCreateModal || eventToEdit !== null;

  return (
    <div className="h-full">
      {!events || events.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-4 h-full">
          <span className="text-white text-center text-2xl font-bold">
            No events found
          </span>
          <Button
            label="Create event"
            size="md"
            onClick={() => {
              setEventToEdit(null);
              setShowCreateModal(true);
            }}
          />
        </div>
      ) : (
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
      )}

      {isModalOpen && (
        <Modal open onClose={closeModal}>
          <CreateEventForm
            key={eventToEdit?.id ?? "create"}
            event={eventToEdit}
            onClose={closeModal}
          />
        </Modal>
      )}
    </div>
  );
};

export default EventList;
