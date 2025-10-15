import { useQuery } from "@tanstack/react-query";
import { fetchWorldGetIslands } from "../services/worldService";

export function useWorldGetIslands(x: number, y: number) {
  return useQuery({
    queryKey: ["worldGetIslands", x+"-"+y],
    queryFn: () => fetchWorldGetIslands({x, y})
  });
}