import axios from "../utils/axios";
import { ResponseBuildingGetInfo } from "@shared/types/responses";
import { RequestBuildingGetInfo } from "@shared/types/requests";

export async function fetchBuildingGetInfo({ cityId }: RequestBuildingGetInfo): Promise<ResponseBuildingGetInfo[]> {
    const response = await axios.post<ResponseBuildingGetInfo[]>("building/getInfo", {
        cityId
    });
    return response.data;
}