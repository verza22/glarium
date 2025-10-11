import { Research } from "../models";
import { WorldConfig } from "../others";

export interface ResponseUserConfig {
    world: WorldConfig,
    research: Research[],
    user_research: number[]
}

export interface ResponseAuth {
    message: string,
    token: string
}