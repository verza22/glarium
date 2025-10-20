import { RequestResearchCreate } from "@shared/types/requests";
import axios from "../utils/axios";
import { ResponseGetResearchData } from "@shared/types/responses";

export async function fetchResearchData(): Promise<ResponseGetResearchData> {
    const response = await axios.post<ResponseGetResearchData>("research/getResearchData");
    return response.data;
}

export async function researchCreate({researchId}: RequestResearchCreate): Promise<string> {
    const response = await axios.post<string>("research/create", { researchId });
    return response.data;
}