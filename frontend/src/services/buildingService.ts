import axios from "../utils/axios";
import { ResponseBuildingAvailable, ResponseBuildingGetInfo } from "@shared/types/responses";
import { RequestBuildingAvailable, RequestBuildingCreate, RequestBuildingGetInfo } from "@shared/types/requests";
import { Resources } from "@shared/types/models";

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

export async function buildingCreate({ cityId, position, buildingId }: RequestBuildingCreate): Promise<Resources> {
    const response = await axios.post<Resources>("building/create", {
        cityId,
        position,
        buildingId
    });
    return response.data;
}