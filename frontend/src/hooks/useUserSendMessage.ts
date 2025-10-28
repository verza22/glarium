import { useMutation } from "@tanstack/react-query";
import { sendMessage } from "../services/userService";
import { useUserStore } from "../store/userStore";

export function useUserSendMessage() {
    const cityFromId = useUserStore(state => state.cityId);

    return useMutation({
        mutationFn: ({ cityId, message }: { cityId: number, message: string }) => sendMessage({ cityFromId, cityId, message }),
    });
}