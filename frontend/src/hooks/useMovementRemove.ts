import { useMutation, useQueryClient } from "@tanstack/react-query";
import { removeMovement } from "../services/movementService";

export function useMovementRemove() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ movementId }: { movementId: number }) => removeMovement({ movementId }),
        onSuccess: (response) => {
            queryClient.invalidateQueries({ queryKey: ["getMovements"] });
            queryClient.invalidateQueries({ queryKey: ["city"] });
        }
    });
}