import axios from "../utils/axios";
import { ResponseMovementColonize } from "@shared/types/responses";
import { RequestMovementColonize } from "@shared/types/requests";

export async function getMovements(): Promise<any> {
    const response = await axios.get("movement/getMovements");
    return response.data;
}

export async function colonize({ islandId, cityId, position }: RequestMovementColonize): Promise<ResponseMovementColonize> {
    const response = await axios.post("movement/colonize", { islandId, cityId, position });
    return response.data;
}