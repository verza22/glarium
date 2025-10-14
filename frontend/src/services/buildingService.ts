import axios from "../utils/axios";
import { ResponseBuildings } from "@shared/types/responses";
import { RequestBuildings } from "@shared/types/requests";

export async function fetchBuilding({ cityId }: RequestBuildings): Promise<ResponseBuildings[]> {
    const response = await axios.post<ResponseBuildings[]>("building/buildings", {
        cityId
    });
    return response.data;
}