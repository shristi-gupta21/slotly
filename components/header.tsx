import { Disclosure } from "@headlessui/react";
import { MagnifyingGlassIcon } from "@heroicons/react/20/solid";
import { BellIcon } from "@heroicons/react/24/outline";
import Button from "./button";

export default function Header() {
  return (
    <Disclosure
      as="header"
      className="relative bg-white/10 backdrop-blur-sm after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:h-px after:bg-white/10"
    >
      <div className="mx-auto  sm:px-4 lg:divide-y lg:divide-white/10 lg:px-8">
        <div className=" flex h-16 justify-between">
          <div className="relative z-0 flex flex-1 items-center justify-center px-2 sm:inset-0">
            <div className="grid w-full grid-cols-1 sm:max-w-xs">
              <input
                name="search"
                placeholder="Search"
                className="col-start-1 row-start-1 block w-full rounded-md bg-white/5 py-1.5 pl-10 pr-3 text-base text-white outline outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
              />
              <MagnifyingGlassIcon
                aria-hidden="true"
                className="pointer-events-none col-start-1 row-start-1 ml-3 size-5 self-center text-gray-400"
              />
            </div>
          </div>

          <div className="hidden lg:relative lg:z-10 lg:ml-4 lg:flex lg:items-center gap-4">
            <Button label="Create Event" size="md" />
            <button
              type="button"
              className="relative shrink-0 rounded-full p-1 text-gray-400 hover:text-white focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-indigo-500"
            >
              <span className="absolute -inset-1.5" />
              <span className="sr-only">View notifications</span>
              <BellIcon aria-hidden="true" className="size-6" />
            </button>
          </div>
        </div>
      </div>
    </Disclosure>
  );
}
