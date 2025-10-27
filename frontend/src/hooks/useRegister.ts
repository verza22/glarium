import { useMutation } from "@tanstack/react-query";
import { registerService } from "../services/authService";
import { useUserStore } from "../store/userStore";

export const useRegister = () => {
    const setUser = useUserStore((state) => state.setUser);
    return useMutation({
        mutationFn: registerService,
        onSuccess: (response, variables) => {
            const { email } = variables;
            setUser({
                userId: response.userId,
                cityId: response.cityId,
                islandId: response.islandId,
                islandX: response.islandX,
                islandY: response.islandY,
                bearerToken: response.token,
                name: response.name,
                email: email
            });
        }
    });
};