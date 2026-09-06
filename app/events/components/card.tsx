import { Event } from "@/app/generated/prisma/client";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { EllipsisHorizontalIcon } from "@heroicons/react/16/solid";
import React from "react";

const Card = ({ event }: { event: Event }) => {
  return (
    <li
      key={event.id}
      className="overflow-hidden rounded-xl outline-1 -outline-offset-1 outline-white/10"
    >
      <div className="flex items-center gap-x-4 border-b border-white/10 bg-gray-800/50 p-6">
        {/* <img
              alt={event.name}
            //   src={event.}
              className="size-12 flex-none rounded-lg bg-gray-700 object-cover ring-1 ring-white/10"
            /> */}
        <div className="text-sm/6 font-medium text-white">{event.name}</div>
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
              <a
                href="#"
                className="block px-3 py-1 text-sm/6 text-white data-focus:bg-white/5 data-focus:outline-none"
              >
                Edit<span className="sr-only">, {event.name}</span>
              </a>
            </MenuItem>
            <MenuItem>
              <a
                href="#"
                className="block px-3 py-1 text-sm/6 text-red-500 data-focus:bg-red-500/20 data-focus:outline-none data-focus:rounded-md"
              >
                Delete<span className="sr-only">, {event.name}</span>
              </a>
            </MenuItem>
          </MenuItems>
        </Menu>
      </div>
      <dl className="-my-3 divide-y divide-white/10 px-6 py-4 text-sm/6">
        <div className="flex justify-between gap-x-4 py-3">
          <dt className="text-gray-400">Date</dt>
          <dd className="text-gray-300">
            <time dateTime={event.date.toString()}>
              {event.date.toString()}
            </time>
          </dd>
        </div>
        <div className="flex justify-between gap-x-4 py-3">
          <dt className="text-gray-400">Capacity</dt>
          <dd className="flex items-start gap-x-2">
            <div className="font-medium text-white">{event.capacity}</div>
          </dd>
        </div>
      </dl>
    </li>
  );
};

export default Card;
