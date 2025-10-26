import axios from "../utils/axios";
import { ResponseIslandGetData, ResponseIslandGetInfo, ResponseIslandSetWorker } from "@shared/types/responses";
import { RequestIslandGetData, RequestIslandGetInfo, RequestIslandSetDonation, RequestIslandSetWorker } from "@shared/types/requests";
import { Resources } from "@shared/types/others";

export async function fetchIslandGetInfo({ islandId }: RequestIslandGetInfo): Promise<ResponseIslandGetInfo> {
    const response = await axios.post<ResponseIslandGetInfo>("island/getInfo", {
        islandId
    });
    return response.data;
}

export async function fetchIslandGetData({ islandId, type }: RequestIslandGetData): Promise<ResponseIslandGetData> {
    const response = await axios.post<ResponseIslandGetData>("island/getData", {
        islandId,
        type
    });
    return response.data;
}

export async function setWorker({ workers, type, cityId }: RequestIslandSetWorker): Promise<ResponseIslandSetWorker> {
    const response = await axios.post<ResponseIslandSetWorker>("island/setWorker", {
        workers,
        type,
        cityId
    });
    return response.data;
}

export async function setDonation({ islandId, type, cityId, wood }: RequestIslandSetDonation): Promise<Resources> {
    const response = await axios.post<Resources>("island/setDonation", {
        islandId,
        type,
        cityId,
        wood
    });
    return response.data;
}