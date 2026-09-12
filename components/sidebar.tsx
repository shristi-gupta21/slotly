"use client";

import { useState } from "react";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  TransitionChild,
} from "@headlessui/react";
import {
  ArrowLeftStartOnRectangleIcon,
  Bars3Icon,
  CalendarIcon,
  DocumentDuplicateIcon,
  HomeIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { usePathname } from "next/navigation";
import Image from "next/image";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: HomeIcon, current: true },
  { name: "Events", href: "/events", icon: CalendarIcon, current: false },
  {
    name: "Bookings",
    href: "/bookings",
    icon: DocumentDuplicateIcon,
    current: false,
  },
];

const logout = [
  { name: "Logout", href: "/login", icon: ArrowLeftStartOnRectangleIcon, current: false },
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

function Sidebar() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const pathname = usePathname();
  return (
    <>
      <div>
        <Dialog
          open={sidebarOpen}
          onClose={setSidebarOpen}
          className="relative z-50 lg:hidden"
        >
          <DialogBackdrop
            transition
            className="fixed inset-0 bg-white/10 backdrop-blur-sm transition-opacity duration-300 ease-linear data-[closed]:opacity-0"
          />

          <div className="fixed inset-0 flex">
            <DialogPanel
              transition
              className="relative mr-16 flex w-full max-w-xs flex-1 transform transition duration-300 ease-in-out data-[closed]:-translate-x-full"
            >
              <TransitionChild>
                <div className="absolute left-full top-0 flex w-16 justify-center pt-5 duration-300 ease-in-out data-[closed]:opacity-0">
                  <button
                    type="button"
                    onClick={() => setSidebarOpen(false)}
                    className="-m-2.5 p-2.5"
                  >
                    <span className="sr-only">Close sidebar</span>
                    <XMarkIcon
                      aria-hidden="true"
                      className="size-6 text-white"
                    />
                  </button>
                </div>
              </TransitionChild>

              {/* Sidebar component, swap this element with another sidebar if you like */}
              <div className="relative flex grow flex-col gap-y-5 overflow-y-auto bg-gray-900 px-6 pb-2 ring-1 ring-white/10">
                <div className="relative flex h-16 shrink-0 items-center">
                  <Image
                    alt="Your Company"
                    src="/logo.svg"
                    className="h-8 w-auto"
                    width={32}
                    height={32}
                  />
                </div>
                <nav className="flex flex-1 flex-col">
                  <ul role="list" className="flex flex-1 flex-col gap-y-7">
                    <li>
                      <ul role="list" className="-mx-2 space-y-1">
                        {navigation.map((item) => (
                          <li key={item.name}>
                            <a
                              href={item.href}
                              className={classNames(
                                item.href === pathname
                                  ? "bg-white/5 text-white"
                                  : "text-gray-400 hover:bg-white/5 hover:text-white",
                                "group flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold",
                              )}
                            >
                              <item.icon
                                aria-hidden="true"
                                className="size-6 shrink-0"
                              />
                              {item.name}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </li>
                  </ul>
                </nav>
              </div>
            </DialogPanel>
          </div>
        </Dialog>

        {/* Static sidebar for desktop */}
        <div className="hidden bg-white/10 backdrop-blur-sm lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
          {/* Sidebar component, swap this element with another sidebar if you like */}
          <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-white/10 px-6">
            <div className="flex h-16 shrink-0 items-center">
              <Image
                alt="Your Company"
                src="/logo.svg"
                className="h-8 w-auto"
                width={32}
                height={32}
              />
            </div>
            <nav className="flex flex-1 flex-col ">
              <ul
                role="list"
                className="flex flex-1 flex-col gap-y-7 justify-between"
              >
                <li>
                  <ul role="list" className="-mx-2 space-y-1">
                    {navigation.map((item) => (
                      <li key={item.name}>
                        <a
                          href={item.href}
                          className={classNames(
                            item.href === pathname
                              ? "bg-white/5 text-white"
                              : "text-gray-400 hover:bg-white/5 hover:text-white",
                            "group flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold",
                          )}
                        >
                          <item.icon
                            aria-hidden="true"
                            className="size-6 shrink-0"
                          />
                          {item.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </li>

                <ul className="flex flex-col gap-y-2 mb-6">
                  <li className="-mx-6 mt-auto">
                    <a
                      href="#"
                      className="flex items-center gap-x-4 px-6 py-3 text-sm/6 font-semibold text-white hover:bg-white/5"
                    >
                      <Image
                        alt=""
                        src="/logo.svg"
                        className="size-8 rounded-full bg-gray-800 outline outline-1 -outline-offset-1 outline-white/10"
                        width={32}
                        height={32}
                      />
                      <span className="sr-only">Your profile</span>
                      <span aria-hidden="true">John Doe</span>
                    </a>
                  </li>
                  {logout.map((item) => (
                    <li key={item.name} className="-mx-6 mt-auto">
                      <a
                        href={item.href}
                        className="flex items-center gap-x-4 px-6 py-3 text-sm/6 font-semibold text-gray-400 hover:bg-white/5 hover:text-white"
                      >
                        <item.icon className="size-6 shrink-0" />
                        <span className="sr-only">Logout</span>
                        <span aria-hidden="true">{item.name}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </ul>
            </nav>
          </div>
        </div>

        <div className="sticky top-0 z-40 flex items-center gap-x-6 bg-white/10 backdrop-blur-sm px-4 py-4 shadow sm:px-6 lg:hidden">
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="-m-2.5 p-2.5 text-gray-400 hover:text-white lg:hidden"
          >
            <span className="sr-only">Open sidebar</span>
            <Bars3Icon aria-hidden="true" className="size-6" />
          </button>
          <div className="flex-1 text-sm/6 font-semibold text-white">
            Dashboard
          </div>
          <a href="#">
            <span className="sr-only">Your profile</span>
            <Image
              alt=""
              src="/logo.svg"
              className="size-8 rounded-full bg-gray-800 outline outline-1 -outline-offset-1 outline-white/10"
              width={32}
              height={32}
            />
          </a>
        </div>
      </div>
    </>
  );
}

export default Sidebar;
