import { create } from "zustand";
import { persist } from "zustand/middleware";
import { AuthService, ProfileService } from "../services";

interface UserState {
  isAuth: boolean;
  name: string;
  avatar: {
    original: string,
    thumbnail: string,
  };
  login: (name: string, password: string) => Promise<void>;
  registration: (name: string, password: string) => Promise<void>;
  logout: () => void;
  loadProfile: () => Promise<void>;
  uploadAvatar: (file: File) => Promise<void>;
  checkAuth: () => Promise<void>;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      isAuth: false,
      name: "",
      avatar: {
        original: "",
        thumbnail: ""
      },

      login: async (name: string, password: string) => {
        const response = await AuthService.login(name, password);

        localStorage.setItem("token", response.data.token);

        set({ isAuth: true });

        await useUserStore.getState().loadProfile();
      },

      registration: async (name: string, password: string) => {
        await AuthService.registration(name, password);
        const response = await AuthService.login(name, password);

        localStorage.setItem("token", response.data.token);

        set({ isAuth: true });

        await useUserStore.getState().loadProfile();
      },

      logout: () => {
        localStorage.removeItem("token");

        set({
          isAuth: false,
          name: "",
          avatar: {
            original: "",
            thumbnail: ""
          },
        });
      },

      loadProfile: async () => {
        try {
          const profile = await ProfileService.getProfile(); 
          console.log(profile.data.name)
          set({
            name: profile.data.name,
            avatar: profile.data.avatar,
          });
        } catch (e) {
          console.error("can't get profile", e);
        }
      },

      uploadAvatar: async (file: File) => {
        const response = await ProfileService.uploadAvatar(file);
        set({
          avatar: response.data.avatarPath
        });
      },


      checkAuth: async () => {
        try {
          const response = await AuthService.tokenIsValid();

          set({ isAuth: response.data.valid });

          if (response.data.valid) {
            await useUserStore.getState().loadProfile();
          } else {
            localStorage.removeItem("token");
            set({ isAuth: false, name: "",  avatar: {original: "", thumbnail: ""} });
          }
        } catch (e) {
          console.error("token is not valid", e);
          localStorage.removeItem("token");
          set({ isAuth: false, name: "",  avatar: {original: "", thumbnail: ""} });
        }
      },
    }),
    {
      name: "auth-store",
      partialize: (state) => ({
        isAuth: state.isAuth,
        name: state.name,
        avatar: state.avatar,
      }),
    }
  )
);
