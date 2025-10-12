import { useNavigate } from "react-router-dom";
import { useUserStore } from "../store/userStore";

export interface INavigationLayout {
    city: () => void,
    island: () => void,
    world: () => void
}

export const useNavigationLayout = (): INavigationLayout => {
    const navigate = useNavigate();
    const { cityId, islandId } = useUserStore();

    return {
        city: () => navigate("/city/" + cityId),
        island: () => navigate("/island/" + islandId),
        world: () => navigate("/world")
    };
};