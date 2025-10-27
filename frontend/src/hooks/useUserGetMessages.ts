import { useQuery } from "@tanstack/react-query";
import { getMessages } from "../services/userService";

export function useUserGetMessages(page: number, type: number) {
    return useQuery({
        queryKey: ["getMessages", page, type],
        queryFn: () => getMessages({ page, type })
    });
}