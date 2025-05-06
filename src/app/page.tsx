"use client";

import { useEffect, useState, useCallback, ChangeEvent } from "react";
import { loadAdvocates } from "@/app/api/advocates/loadAdvocates";
import { AdvocatesType } from "@/db/schema";
import debounce from "lodash/debounce";
import AdvocateTable from "@/app/components/advocate-table";

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("");
  const [advocates, setAdvocates] = useState<AdvocatesType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchAndSetAdvocates = async (term: string) => {
    setIsLoading(true);
    try {
      const results = await loadAdvocates(term);
      setAdvocates(results);
    } catch (err) {
      console.error("Failed to load advocates", err);
    } finally {
      setIsLoading(false);
    }
  };

  const debouncedFetch = useCallback(
    debounce((term: string) => {
      fetchAndSetAdvocates(term);
    }, 300),
    []
  );

  useEffect(() => {
    debouncedFetch(searchTerm);
  }, [searchTerm, debouncedFetch]);

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);
  };

  const handleReset = () => {
    setSearchTerm("");
  };

  return (
    <main className="m-6 flex flex-col gap-6">
      <h1 className="text-xl font-semibold">Solace Advocates</h1>

      <div>
        <p className="text-lg">Search</p>
        <div className="flex gap-2">
          <label className="flex grow-0 items-center gap-1 text-sm text-gray-500">
            <span className="shrink-0">Search for:</span>
            <input
              className="w-full border border-teal-800 rounded focus:outline-none py-1.5 px-2 focus-visible:ring-1 ring-teal-800"
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </label>
          <button
            className="shrink-0 bg-teal-800 outline-none text-white py-1.5 px-3 rounded hover:bg-teal-900 focus-visible:bg-teal-900"
            onClick={handleReset}
          >
            Reset Search
          </button>
        </div>
      </div>

      <AdvocateTable isLoading={isLoading} items={advocates} />
    </main>
  );
}
