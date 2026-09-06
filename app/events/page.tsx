import React from "react";
import Card from "./components/card";
import { Event } from "../generated/prisma/client";

const Events = async () => {
  const result = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/events`);
  const { events } = await result.json();
    console.log(events);
  return <div>
    <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {events.map((event: Event) => (
        <Card key={event.id} event={event} />
      ))}
    </ul>
  </div>;
};

export default Events;
