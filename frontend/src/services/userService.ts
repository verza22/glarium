import axios from "../utils/axios";
import { ResponseUserBuyTradeShip } from "@shared/types/responses";

export async function buyTradeShip(): Promise<ResponseUserBuyTradeShip> {
    const response = await axios.post<ResponseUserBuyTradeShip>("user/buyTradeShip");
    return response.data;
}