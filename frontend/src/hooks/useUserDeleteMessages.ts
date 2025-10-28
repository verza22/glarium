import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteMessages } from "../services/userService";

export function useUserDeleteMessages() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ messages, type }: { messages: number[], type: boolean }) => deleteMessages({ messages, type }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["getMessages"] });
        }
    });
}