import { useMutation } from "@tanstack/react-query";
import { readMessage } from "../services/userService";

export function useUserReadMessage() {
    return useMutation({
        mutationFn: ({ messageId }: { messageId: number }) => readMessage({ messageId }),
    });
}