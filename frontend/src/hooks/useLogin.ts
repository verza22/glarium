import { useMutation } from "@tanstack/react-query";
import { loginService } from "../services/authService";
import { useUserStore } from "../store/userStore";

export const useLogin = () => {
    const setUser = useUserStore((state) => state.setUser);
    return useMutation({
        mutationFn: loginService,
        onSuccess: (response, variables) => {
            const { email } = variables;
            setUser({
                userId: response.userId,
                cityId: response.cityId,
                islandId: response.islandId,
                islandX: response.islandX,
                islandY: response.islandY,
                bearerToken: response.token,
                email: email,
                name: response.name,
                worldConfig: response.worldConfig
            });
        }
    });
};