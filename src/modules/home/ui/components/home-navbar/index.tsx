import { SidebarTrigger } from "@/components/ui/sidebar";
import Image from "next/image";
import Link from "next/link";
import { SearchInput } from "./search-input";
import { AuthButton } from "@/modules/auth/ui/components/auth-button";

export const HomeNavbar = () => {
  return (
    <nav className="flex items-center fixed top-0 left-0 right-0 z-50 bg-white px-2 pr-5 h-16">
      <div className="flex items-center gap-4 w-full">
        <div className="flex items-center shrink-0">
          <SidebarTrigger />

          <Link href="/">
            <div className="p-4 flex items-center gap-1">
              <Image src="/logo.svg" alt="Logo" width={32} height={32} />
              <p className="text-xl font-semibold tracking-tight">NewTube</p>
            </div>
          </Link>
        </div>
        <div className="flex-1 justify-center max-w-180 mx-auto">
          <SearchInput />
        </div>

        <div className="flex shrink-0 items-center">
            <AuthButton/>
     
        </div>
      </div>
    </nav>
  );
};
