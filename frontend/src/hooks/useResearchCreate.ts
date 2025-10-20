import { useMutation } from "@tanstack/react-query";
import { researchCreate } from "../services/researchService";

export const useResearchCreate = () => {
    return useMutation({
        mutationFn: researchCreate
    });
};