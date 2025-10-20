import { useQuery } from "@tanstack/react-query";
import { fetchResearchData } from "../services/researchService";

export function useResearchData() {
  return useQuery({
    queryKey: ["researchData"],
    queryFn: () => fetchResearchData()
  });
}