import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UserState {
    userId: number,
    cityId: number,
    islandId: number,
    islandX: number,
    islandY: number,
    bearerToken: string,
    email: string,
    setUser: (data: Partial<UserState>) => void,
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

            setUser: (data) => set((state) => ({ ...state, ...data })),

            clearUser: () =>
                set({
                    userId: 0,
                    cityId: 0,
                    islandId: 0,
                    islandX: 0,
                    islandY: 0,
                    bearerToken: "",
                    email: ""
                }),
        }),
        {
            name: "user-storage"
        }
    )
);