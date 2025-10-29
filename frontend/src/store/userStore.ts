import { WorldConfig } from "@shared/types/others";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface ChangeCity {
    cityId: number,
    islandId: number,
    islandX: number,
    islandY: number
}

interface UserState {
    userId: number,
    cityId: number,
    islandId: number,
    islandX: number,
    islandY: number,
    bearerToken: string,
    email: string,
    name: string,
    worldConfig: WorldConfig ,
    setUser: (data: Partial<UserState>) => void,
    changeCity: (data: ChangeCity) => void,
    clearUser: () => void
};

export const useUserStore = create<UserState>()(
    persist(
        (set) => ({
            userId: 0,
            cityId: 0,
            islandId: 0,
            islandX: 0,
            islandY: 0,
            bearerToken: "",
            email: "",
            name: "",
            worldConfig: {
                transport: 0,
                load_speed: 0,
                load_speed_base: 0,
                load_attack_return: 0,
                load_defend_return: 0,
                bonus: {
                    resources: 0,
                    tavern: 0,
                    tavern_consume: 0
                },
                warehouse: {
                    resource_protected: 0,
                    resource_protected_base: 0,
                    capacity: 0,
                    capacity_base: 0
                },
                distance: {
                    same_island: 0
                },
                combat: {
                    wall_bonus: 0
                },
                colonize: {
                    wood: 0,
                    gold: 0,
                    population: 0
                },
                messages: {
                    cant: 0,
                    time: 0
                }
            },

            setUser: (data) => set((state) => ({ ...state, ...data })),
            changeCity: (data) => set((state) => ({ ...state, ...data })),

            clearUser: () =>
                set({
                    userId: 0,
                    cityId: 0,
                    islandId: 0,
                    islandX: 0,
                    islandY: 0,
                    bearerToken: "",
                    email: "",
                    name: "",
                    worldConfig: {
                        transport: 0,
                        load_speed: 0,
                        load_speed_base: 0,
                        load_attack_return: 0,
                        load_defend_return: 0,
                        bonus: {
                            resources: 0,
                            tavern: 0,
                            tavern_consume: 0
                        },
                        warehouse: {
                            resource_protected: 0,
                            resource_protected_base: 0,
                            capacity: 0,
                            capacity_base: 0
                        },
                        distance: {
                            same_island: 0
                        },
                        combat: {
                            wall_bonus: 0
                        },
                        colonize: {
                            wood: 0,
                            gold: 0,
                            population: 0
                        },
                        messages: {
                            cant: 0,
                            time: 0
                        }
                    }
                }),
        }),
        {
            name: "user-storage"
        }
    )
);