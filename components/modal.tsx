"use client";

import { JSX,  } from "react";
import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";

export default function Modal({ children, open, onClose }: { children: JSX.Element, open: boolean, onClose: () => void }) {
  return (
    <div>
      <Dialog open={open} onClose={onClose} className="relative z-50">
        <DialogBackdrop
          transition
          className="fixed inset-0 bg-gray-500/75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
        />

        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <DialogPanel className="relative">
              {children}
            </DialogPanel>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
