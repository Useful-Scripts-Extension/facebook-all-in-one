import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { persist } from 'zustand/middleware';

const store = (set, get) => ({
    persist: {
        darkMode: false,
        profile: null,
    },
    messages: [],
    friends: [],
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
    setFriends: friends =>
        set(state => {
            state.friends = friends;
        }),
});

export const selectors = {
    hydrated: state => state.hydrated,
    darkMode: state => state.persist.darkMode,
    profile: state => state.persist.profile,
    messages: state => state.messages,
    friends: state => state.friends,

    setDarkMode: state => state.setDarkMode,
    setProfile: state => state.setProfile,
    setMessages: state => state.setMessages,
    setFriends: state => state.setFriends,
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
