import axios from "../utils/axios";
import { RequestUserGetMayor, RequestUserGetMessages } from "@shared/types/requests";
import { ResponseUserBuyTradeShip, ResponseUserGetMayor } from "@shared/types/responses";

export async function buyTradeShip(): Promise<ResponseUserBuyTradeShip> {
    const response = await axios.post<ResponseUserBuyTradeShip>("user/buyTradeShip");
    return response.data;
}

export async function getMayor({ page }: RequestUserGetMayor): Promise<ResponseUserGetMayor> {
    const response = await axios.post<ResponseUserGetMayor>("user/getMayor", { page });
    return response.data;
}

export async function getMessages({ page, type }: RequestUserGetMessages): Promise<any> {
    const response = await axios.post<any>("user/getMessages", { page, type });
    return response.data;
}