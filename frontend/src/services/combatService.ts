import axios from "../utils/axios";
import { RequestCombatMovement } from "@shared/types/requests";

export async function combatMovement({ cityFromId, units, cants, tradeShip, cityId }: RequestCombatMovement): Promise<string> {
    const response = await axios.post("combat/combatMovement", { cityFromId, units, cants, tradeShip, cityId });
    return response.data;
}