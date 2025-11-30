import { create } from "zustand"
import { persist } from "zustand/middleware"
import { AuthService } from "../services";

interface UserState {
    isAuth: boolean;
    name: string;
    login: (name: string, password: string) => Promise<void>;
    registration: (name: string, password: string) => Promise<void>;
    logout: () => void;
}

export const useUserStore = create<UserState>()(
    persist(
        (set) => ({
            isAuth: false,
            name: "",

            login: async (name: string, password: string) => {
                try {
                    const response = await AuthService.login(name, password);
                    localStorage.setItem('token', response.data.token);

                    set({
                        isAuth: true,
                        name: name
                    });
                } catch (e: any) {
                    console.log(e.response?.data?.message);
                    throw e;
                }
            },

            registration: async (name: string, password: string) => {
                try {
                    await AuthService.registration(name, password);
                    const response = await AuthService.login(name, password);
                    localStorage.setItem('token', response.data.token);

                    set({
                        isAuth: true,
                        name: name
                    });
                } catch (e: any) {
                    console.error(e.response?.data?.message);
                    throw e;
                }
            },

            logout: () => {
                localStorage.removeItem('token');
                set({
                    isAuth: false,
                    name: ""
                });
            }
        }),
        {
            name: "auth-store",
            partialize: (state) => ({
                isAuth: state.isAuth,
                name: state.name
            })
        }
    )
);