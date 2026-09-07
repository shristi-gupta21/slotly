import React from "react";
import EventList from "./components/event-list";

const Events = async () => {
  const result = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/events`);
  const { events } = await result.json();

  return (
    <div>
      <EventList events={events} />
    </div>
  );
};

export default Events;
