import { Research } from "../models";
import { WorldConfig } from "../others";

export interface ResponseUserConfig {
    world: WorldConfig,
    research: Research[],
    user_research: number[]
}

export interface ResponseAuth {
    message: string,
    token: string,
    userId: number,
    cityId: number,
    islandId: number,
    islandX: number,
    islandY: number,
    name: string,
    worldConfig: WorldConfig
}

export interface ResponseUserBuyTradeShip {
    newGold: number,
    newTradeShip: number,
    newTradeAvailableShip: number
}

export interface ResponseUserGetMayor {
    total: number;
    items: {
        fecha: string;
        city_id: number;
        city_name: string;
        type: number;
        readed: number;
        data: any;
    }[];
    more: boolean;
    page: number;
}