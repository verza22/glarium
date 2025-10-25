import { useBuildingStore } from "../store/buildingStore";
import { useCityStore } from "../store/cityStore";
import { useUserStore } from "../store/userStore";

export function useGetCurrentCity() {
    const cityId = useUserStore(state=> state.cityId);
    const cities = useCityStore(state=> state.cities);
    let city = null;

    let i = cities.findIndex(c=> c.id === cityId);
    if(i>=0)
        city = cities[i];

    return city;
}