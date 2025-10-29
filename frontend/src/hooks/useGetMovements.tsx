import { useQuery } from "@tanstack/react-query";
import { getMovements } from "../services/movementService";

export function useGetMovements() {
    return useQuery({
        queryKey: ["getMovements"],
        queryFn: () => getMovements(),
        staleTime: 0
    });
}