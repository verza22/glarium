import axios from "../utils/axios";
import { RequestUnitCreate } from "@shared/types/requests";
import { ResponseUnitCreate } from "@shared/types/responses";

export async function unitCreate({ cityId, units, cants }: RequestUnitCreate): Promise<ResponseUnitCreate> {
    const response = await axios.post<ResponseUnitCreate>("unit/create", {
        cityId,
        units,
        cants
    });
    return response.data;
}
