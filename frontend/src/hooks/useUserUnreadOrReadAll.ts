import { useMutation, useQueryClient } from "@tanstack/react-query";
import { unreadOrReadAll } from "../services/userService";

export function useUserUnreadOrReadAll() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ readed }: { readed: boolean }) => unreadOrReadAll({ readed }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["getMessages"] });
        }
    });
}