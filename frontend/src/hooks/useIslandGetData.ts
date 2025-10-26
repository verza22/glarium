import { useMutation } from "@tanstack/react-query";
import { fetchIslandGetData } from "../services/islandService";

export function useIslandGetData() {
    return useMutation({
        mutationFn: fetchIslandGetData
    });
}