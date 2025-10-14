import axios from "../utils/axios";
import { ResponseIslandGetInfo } from "@shared/types/responses";
import { RequestIslandGetInfo } from "@shared/types/requests";

export async function fetchIslandGetInfo({ islandId }: RequestIslandGetInfo): Promise<ResponseIslandGetInfo> {
    const response = await axios.post<ResponseIslandGetInfo>("island/getInfo", {
        islandId
    });
    return response.data;
}