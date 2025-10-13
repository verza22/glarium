import axios from "../utils/axios";
import { ResponseCityGetInfo } from "@shared/types/responses";

export async function fetchCityGetInfo(cityId: number): Promise<ResponseCityGetInfo> {
    const response = await axios.post<ResponseCityGetInfo>("city/getInfo", {
        cityId
    });
    return response.data;
}