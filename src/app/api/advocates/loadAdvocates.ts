import { AdvocatesType } from "@/db/schema";
import Fuse, { IFuseOptions } from "fuse.js";

// Cache to simulate server persistence
let cache: AdvocatesType[] = [];

const fuseOptions: IFuseOptions<AdvocatesType> = {
  threshold: 0.3,
  keys: [
    "firstName",
    "lastName",
    "city",
    "degree",
    "specialties",
    "yearsOfExperience",
    "phoneNumber",
  ],
  ignoreLocation: true,
  includeScore: true,
};

export async function loadAdvocates(searchTerm: string): Promise<AdvocatesType[]> {
  // Simulate latency
  await new Promise((resolve) => setTimeout(resolve, Math.random() * 600));

  // Fetch and cache once
  if (cache.length === 0) {
    const response = await fetch("/api/advocates");
    const data = await response.json();
    cache = data.data;
  }

  if (!searchTerm) {
    return cache;
  }

  const fuse = new Fuse(cache, fuseOptions);
  const results = fuse.search(searchTerm).map((r) => r.item);
  return results;
}
