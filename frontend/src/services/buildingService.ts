import axios from "../utils/axios";
import { ResponseBuildingAvailable, ResponseBuildingGetInfo, ResponseBuildingNextLevel } from "@shared/types/responses";
import { RequestBuildingAvailable, RequestBuildingCreate, RequestBuildingGetInfo, RequestBuildingNextLevel, RequestBuildingUpgrade } from "@shared/types/requests";
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

export async function buildingNextLevel({ position, buildingId, cityId }: RequestBuildingNextLevel): Promise<ResponseBuildingNextLevel> {
    const response = await axios.post<ResponseBuildingNextLevel>("building/nextLevel", {
        position,
        buildingId,
        cityId
    });
    return response.data;
}

export async function buildingUpgrade({ cityBuildingId }: RequestBuildingUpgrade): Promise<Resources> {
    const response = await axios.post<Resources>("building/upgrade", {
        cityBuildingId
    });
    return response.data;
}