import axios from "../utils/axios";
import { RequestUserDeleteMessages, RequestUserGetMayor, RequestUserGetMessages, RequestUserReadMessage, RequestUserSendMessage, RequestUserUnreadOrReadAll } from "@shared/types/requests";
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

export async function sendMessage({ cityFromId, message, cityId }: RequestUserSendMessage): Promise<string> {
    const response = await axios.post<string>("user/sendMessage", { cityFromId, message, cityId });
    return response.data;
}

export async function readMessage({ messageId }: RequestUserReadMessage): Promise<string> {
    const response = await axios.post<string>("user/readMessage", { messageId });
    return response.data;
}

export async function unreadOrReadAll({ readed }: RequestUserUnreadOrReadAll): Promise<string> {
    const response = await axios.post<string>("user/unreadOrReadAll", { readed });
    return response.data;
}

export async function deleteMessages({ messages, type }: RequestUserDeleteMessages): Promise<string> {
    const response = await axios.post<string>("user/deleteMessages", { messages, type });
    return response.data;
}