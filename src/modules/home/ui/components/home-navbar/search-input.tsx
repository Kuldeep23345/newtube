import { SearchIcon } from "lucide-react";

export const SearchInput = () => {
  return (
    <form className="flex w-full max-w-150">
      <div className="relative w-full">
        <input
          type="text"
          placeholder="Search"
          className="w-full pl-4 py-2 pr-12 rounded-l-full border focus:outline-none focus:border-blue-500"
        />
      </div>
      <button
        type="submit"
        className="px-5 py-2.5 rounded-r-full border border-l-0 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <SearchIcon className="w-5 h-5 m-auto" />
      </button>
    </form>
  );
};
