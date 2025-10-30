import axios from "../utils/axios";
import { RequestUnitCity, RequestUnitCreate } from "@shared/types/requests";
import { ResponseUnitCity, ResponseUnitCreate } from "@shared/types/responses";

export async function unitCreate({ cityId, units, cants }: RequestUnitCreate): Promise<ResponseUnitCreate> {
    const response = await axios.post<ResponseUnitCreate>("unit/create", {
        cityId,
        units,
        cants
    });
    return response.data;
}

export async function unitCity({ cityId }: RequestUnitCity): Promise<ResponseUnitCity> {
    const response = await axios.post<ResponseUnitCity>("unit/city", {
        cityId
    });
    return response.data;
}