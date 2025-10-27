import { useQuery } from "@tanstack/react-query";
import { getMayor } from "../services/userService";

export function useUserGerMayor(page: number) {
    return useQuery({
        queryKey: ["getMayor", page],
        queryFn: () => getMayor({ page })
    });
}