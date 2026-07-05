import { writable } from 'svelte/store';
import { auth } from '../firebase.js';
import { onAuthStateChanged } from 'firebase/auth';

function createAuthStore() {
    const { subscribe, set } = writable({
        user: null,
        loading: true,
        isLoggedIn: false
    });

    return {
        subscribe,
        setUser: (user) => set({ user, loading: false, isLoggedIn: true }),
        clearUser: () => set({ user: null, loading: false, isLoggedIn: false })
    };
}

const authStore = createAuthStore();

onAuthStateChanged(auth, (user) => {
    if (user) {
        authStore.setUser(user);
    } else {
        authStore.clearUser();
    }
});

export default authStore;
