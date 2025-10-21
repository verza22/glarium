import axios from "../utils/axios";
import { ResponseBuildingAvailable, ResponseBuildingGetInfo } from "@shared/types/responses";
import { RequestBuildingAvailable, RequestBuildingGetInfo } from "@shared/types/requests";

export async function fetchBuildingGetInfo({ cityId }: RequestBuildingGetInfo): Promise<ResponseBuildingGetInfo[]> {
    const response = await axios.post<ResponseBuildingGetInfo[]>("building/getInfo", {
        cityId
    });
    return response.data;
}

export async function fetchBuildingAvailable({ cityId, position }: RequestBuildingAvailable): Promise<ResponseBuildingAvailable[]> {
    const response = await axios.post<ResponseBuildingAvailable[]>("building/available", {
        cityId,
        position
    });
    return response.data;
}