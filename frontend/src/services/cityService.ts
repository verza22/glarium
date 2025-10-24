import axios from "../utils/axios";
import { RequestCityGetInfo, RequestCitySetScientists, RequestCitySetWine } from "@shared/types/requests";
import { ResponseCityGetInfo } from "@shared/types/responses";

export async function fetchCityGetInfo({cityId}: RequestCityGetInfo): Promise<ResponseCityGetInfo> {
    const response = await axios.post<ResponseCityGetInfo>("city/getInfo", {
        cityId
    });
    return response.data;
}

export async function citySetWine({wine, cityId}: RequestCitySetWine): Promise<number> {
    const response = await axios.post<number>("city/setWine", {
        cityId,
        wine
    });
    return response.data;
}

export async function citySetScientists({scientists, cityId}: RequestCitySetScientists): Promise<number> {
    const response = await axios.post<number>("city/setScientists", {
        cityId,
        scientists
    });
    return response.data;
}