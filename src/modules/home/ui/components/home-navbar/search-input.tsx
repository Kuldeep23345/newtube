"use client";

import { Button } from "@/components/ui/button";
import { SearchIcon, XIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";

interface SearchInputProps {
  autoFocus?: boolean;
  onSubmitComplete?: () => void;
}

export const SearchInput = ({
  autoFocus,
  onSubmitComplete,
}: SearchInputProps) => {
  return (
    <Suspense fallback={<Skeleton className="h-10 w-full" />}>
      <SearchInputSuspense
        autoFocus={autoFocus}
        onSubmitComplete={onSubmitComplete}
      />
    </Suspense>
  );
};

const SearchInputSuspense = ({
  autoFocus,
  onSubmitComplete,
}: {
  autoFocus?: boolean;
  onSubmitComplete?: () => void;
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams.get("query") || "";
  const categoryId = searchParams.get("categoryId") || "";
  const [value, setValue] = useState(query);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const newQuery = value.trim();
    if (!newQuery) return;

    const params = new URLSearchParams();

    params.set("query", newQuery);

    if (categoryId) {
      params.set("categoryId", categoryId);
    }

    setValue(newQuery);
    router.push(`/search?${params.toString()}`);

    // ✅ CLOSE MOBILE SEARCH PANEL
    onSubmitComplete?.();
  };

  return (
    <form className="flex w-full max-w-150" onSubmit={handleSubmit}>
      <div className="relative w-full">
        <input
          type="text"
          placeholder="Search"
          value={value}
          autoFocus={autoFocus}
          onChange={(e) => setValue(e.target.value)}
          className="w-full pl-4 py-2 pr-12 rounded-l-full border focus:outline-none focus:border-blue-500"
        />

        {value && (
          <Button
            type="button"
            variant="ghost"
            onClick={() => setValue("")}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full"
          >
            <XIcon className="text-gray-500" />
          </Button>
        )}
      </div>

      <button
        disabled={!value.trim()}
        type="submit"
        className="px-5 py-2.5 rounded-r-full border border-l-0 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <SearchIcon className="w-5 h-5 m-auto" />
      </button>
    </form>
  );
};
