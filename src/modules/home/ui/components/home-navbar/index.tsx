"use client";

import { useState } from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import Image from "next/image";
import Link from "next/link";
import { Search, X } from "lucide-react";

import { SearchInput } from "./search-input";
import { AuthButton } from "@/modules/auth/ui/components/auth-button";

export const HomeNavbar = () => {
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white h-16 px-2 pr-5 flex items-center">
        <div className="flex items-center w-full gap-4">
          {/* LEFT */}
          <div className="flex items-center shrink-0 gap-2">
            <SidebarTrigger />

            {/* Logo — visible on mobile + desktop */}
            <Link prefetch href="/" className="flex items-center gap-1">
              <Image src="/logo.svg" alt="Logo" width={32} height={32} />
              <p className=" sm:block md:text-xl text-md font-semibold tracking-tight">
                NewTube
              </p>
            </Link>
          </div>

          {/* CENTER — Desktop Search */}
          <div className="hidden sm:hidden md:flex flex-1 justify-center max-w-180 mx-auto">
            <SearchInput />
          </div>

          <div className="md:hidden w-full" />

          {/* RIGHT */}
          <div className="flex shrink-0 items-center  gap-2 ">
            {/* Mobile Search Icon */}
            <button
              onClick={() => setMobileSearchOpen(true)}
              className="md:hidden p-2 rounded-full hover:bg-muted"
              aria-label="Open search"
            >
              <Search className="w-5 h-5 " />
            </button>

            <AuthButton />
          </div>
        </div>
      </nav>

      {/* MOBILE SEARCH OVERLAY */}
      {mobileSearchOpen && (
        <div className="fixed inset-0 z-60 bg-white flex flex-col">
          {/* Header */}
          <div className="h-16 px-4 flex items-center gap-3 border-b">
            <button
              onClick={() => setMobileSearchOpen(false)}
              className="p-2 rounded-full hover:bg-muted"
              aria-label="Close search"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex-1">
              <SearchInput
                autoFocus
                onSubmitComplete={() => setMobileSearchOpen(false)}
              />
            </div>
          </div>

          {/* Optional content area */}
          <div className="flex-1 overflow-y-auto" />
        </div>
      )}
    </>
  );
};
