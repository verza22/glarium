import axios from "../utils/axios";
import { ResponseMovementColonize, ResponseMovementTransport } from "@shared/types/responses";
import { RequestMovementColonize, RequestMovementRemove, RequestMovementTransport } from "@shared/types/requests";

export async function getMovements(): Promise<any> {
    const response = await axios.get("movement/getMovements");
    return response.data;
}

export async function colonize({ islandId, cityId, position }: RequestMovementColonize): Promise<ResponseMovementColonize> {
    const response = await axios.post("movement/colonize", { islandId, cityId, position });
    return response.data;
}

export async function transport({ cityId, cityToId, wood, wine, marble, glass, sulfur }: RequestMovementTransport): Promise<ResponseMovementTransport> {
    const response = await axios.post("movement/transport", { cityId, cityToId, wood, wine, marble, glass, sulfur });
    return response.data;
}

export async function removeMovement({ movementId }: RequestMovementRemove): Promise<string> {
    const response = await axios.post("movement/removeMovement", { movementId });
    return response.data;
}