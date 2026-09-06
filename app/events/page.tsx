import React from "react";

const Events = async () => {
  const result = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/events`);
  const events = await result.json();
  console.log(events);
  return <div>Events</div>;
};

export default Events;
