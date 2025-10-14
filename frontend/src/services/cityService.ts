import axios from "../utils/axios";
import { RequestCityGetInfo } from "@shared/types/requests";
import { ResponseCityGetInfo } from "@shared/types/responses";

export async function fetchCityGetInfo({cityId}: RequestCityGetInfo): Promise<ResponseCityGetInfo> {
    const response = await axios.post<ResponseCityGetInfo>("city/getInfo", {
        cityId
    });
    return response.data;
}