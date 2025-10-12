import { create } from "zustand";
import { persist } from "zustand/middleware";

type UserState = {
    userId: number | null;
    cityId: number | null;
    islandId: number | null;
    bearerToken: string | null;
    email: string | null;
    setUser: (data: Partial<UserState>) => void;
    clearUser: () => void;
};

export const useUserStore = create<UserState>()(
    persist(
        (set) => ({
            userId: null,
            cityId: null,
            islandId: null,
            bearerToken: null,
            email: null,

            setUser: (data) => set((state) => ({ ...state, ...data })),

            clearUser: () =>
                set({
                    userId: null,
                    cityId: null,
                    islandId: null,
                    bearerToken: null,
                    email: null,
                }),
        }),
        {
            name: "user-storage"
        }
    )
);