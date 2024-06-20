import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { persist } from 'zustand/middleware';

const store = (set, get) => ({
  persist: {
    darkMode: false,
    profile: null,
  },
  messages: [],
  setDarkMode: darkMode =>
    set(state => {
      state.persist.darkMode = darkMode;
    }),
  setProfile: profile =>
    set(state => {
      state.persist.profile = profile;
    }),
  setMessages: messages =>
    set(state => {
      state.messages = messages;
    }),
});

export const selectors: {
  [key: string]: (state: ReturnType<typeof store>) => any;
} = {
  darkMode: state => state.persist.darkMode,
  profile: state => state.persist.profile,
  messages: state => state.messages,
  setDarkMode: state => state.setDarkMode,
  setProfile: state => state.setProfile,
  setMessages: state => state.setMessages,
  hydrated: state => state.hydrated,
};

const useStore = create(
  immer(
    persist(
      (set, get) => ({
        ...store(set, get),

        hydrated: false,
        setHasHydrated: state => {
          set({
            hydrated: state,
          });
        },
      }),
      {
        name: 'facebook-all-in-one-extension',
        partialize: state => ({
          persist: state.persist,
        }),
        onRehydrateStorage: () => (state, error) => {
          state.setHasHydrated(true);
        },
      }
    )
  )
);

export default useStore;
