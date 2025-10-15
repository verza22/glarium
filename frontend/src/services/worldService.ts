import axios from "../utils/axios";
import { RequestWorldGetIslands } from "@shared/types/requests";
import { ResponseWorldGetIslands } from "@shared/types/responses";

export async function fetchWorldGetIslands({ x, y }: RequestWorldGetIslands): Promise<ResponseWorldGetIslands[]> {
    const response = await axios.post<ResponseWorldGetIslands[]>("world/getIslands", {
        x,
        y
    });
    return response.data;
}