import axios from "../utils/axios";
import { RequestUserLogin, RequestUserRegister } from "@shared/types/requests";
import { ResponseAuth } from "@shared/types/responses";

export async function loginService(data: RequestUserLogin): Promise<ResponseAuth> {
    const response = await axios.post<ResponseAuth>("auth/login", {
        ...data
    });
    return response.data;
}

export async function registerService(data: RequestUserRegister): Promise<ResponseAuth> {
    const response = await axios.post<ResponseAuth>("auth/register", {
        ...data
    });
    return response.data;
}