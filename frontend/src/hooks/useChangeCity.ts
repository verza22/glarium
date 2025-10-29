import { useNavigate } from "react-router-dom";
import { ChangeCity, useUserStore } from "../store/userStore";

export const useChangeCity = () => {
    const navigate = useNavigate();
    const changeCity = useUserStore(state => state.changeCity);

    const mutate = (data: ChangeCity) => {
        changeCity(data);
        navigate("/city/" + data.cityId);
    };

    return mutate;
};