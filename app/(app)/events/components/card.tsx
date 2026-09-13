import { Event } from "@/app/generated/prisma/client";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { EllipsisHorizontalIcon } from "@heroicons/react/16/solid";
import React from "react";

function formatDate(value: Date | string) {
  const date = typeof value === "string" ? new Date(value) : value;
  return date.toISOString().slice(0, 10);
}

function formatTime(value: Date | string) {
  const date = typeof value === "string" ? new Date(value) : value;
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${hours}:${minutes}`;
}

const Card = ({
  event,
  onDelete,
  onEdit,
}: {
  event: Event;
  onDelete: (id: string) => void;
  onEdit: (event: Event) => void;
}) => {
  const {
    date,
    capacity,
    description,
    city,
    venue,
    time,
    contactName,
    phone,
    email,
  } = event;

  const details: { label: string; value: string | number; dateTime?: string }[] =
    [
      { label: "Date", value: formatDate(date), dateTime: formatDate(date) },
      { label: "Time", value: formatTime(time) },
      { label: "Capacity", value: capacity },
      { label: "Venue", value: venue },
      { label: "City", value: city },
      { label: "Contact name", value: contactName },
      { label: "Phone", value: phone },
      { label: "Email", value: email },
    ];

  return (
    <li className="overflow-hidden rounded-xl outline-1 -outline-offset-1 outline-white/10">
      <div className="flex items-start gap-x-4 border-b border-white/10 bg-gray-800/50 p-6">
        <div className="flex flex-col gap-4">
          <div className="text-sm/6 font-medium text-white">{event.name}</div>
          {description ? (
            <span className="text-sm/6 text-white">{description}</span>
          ) : null}
        </div>
        <Menu as="div" className="relative ml-auto">
          <MenuButton className="relative block text-gray-400 hover:text-white">
            <span className="absolute -inset-2.5" />
            <span className="sr-only">Open options</span>
            <EllipsisHorizontalIcon aria-hidden="true" className="size-5" />
          </MenuButton>
          <MenuItems
            transition
            className="absolute right-0 z-10 mt-0.5 w-32 origin-top-right rounded-md bg-gray-800 py-2 outline-1 -outline-offset-1 outline-white/10 transition data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-leave:duration-75 data-enter:ease-out data-leave:ease-in"
          >
            <MenuItem>
              <button
                type="button"
                onClick={() => onEdit(event)}
                className="block px-3 py-1 text-sm/6 text-white data-focus:bg-white/5 data-focus:outline-none data-focus:rounded-md data-focus:w-full data-focus:text-left"
              >
                Edit<span className="sr-only">, {event.name}</span>
              </button>
            </MenuItem>
            <MenuItem>
              <button
                type="button"
                onClick={() => onDelete(event.id)}
                className="block px-3 py-1 text-sm/6 text-red-500 data-focus:bg-red-500/20 data-focus:outline-none data-focus:rounded-md data-focus:w-full data-focus:text-left"
              >
                Delete<span className="sr-only">, {event.name}</span>
              </button>
            </MenuItem>
          </MenuItems>
        </Menu>
      </div>
      <dl className="-my-3 divide-y divide-white/10 px-6 py-4 text-sm/6">
        {details.map(({ label, value, dateTime }) => (
          <div key={label} className="flex justify-between gap-x-4 py-3">
            <dt className="text-gray-400">{label}</dt>
            <dd className="font-medium text-white">
              {dateTime ? <time dateTime={dateTime}>{value}</time> : value}
            </dd>
          </div>
        ))}
      </dl>
    </li>
  );
};

export default Card;
