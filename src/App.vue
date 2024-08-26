<template>
  <v-app>
    <v-main>
      <router-view ></router-view>
    </v-main>
  </v-app>
</template>

<script>
import { onMounted, onBeforeUnmount, ref } from 'vue';
import { useAuthStore } from "./stores/auth";
import { useRouter } from "vue-router";
import { eventBus } from './event_bus';

export default {
  name: "App",
  setup() {
    const authStore = useAuthStore();
    const router = useRouter();
    const authReady = ref(false);
    const route = router.options.history.location;
    const token = localStorage.getItem("token");
    // router.push("/sign-in");
    if (token) {
      authStore.setAccessToken(token);
      authStore.attempt().then(() => {
        authReady.value = true;
      }).catch((error) => {
        console.error("Error in App setup hook:", error);
        // Nếu đang ở trang signup thì điều hướng về signup, nếu không thì về sign-in
        if (route === '/sign-up') {
          router.push("/sign-up");
        } else {
          router.push("/sign-in");
        }
      });
    } else {
      router.push("/sign-in");
    }

    const handleStorageChange = (event) => {
      if (event.key === 'token' && !localStorage.getItem('token')) {
        eventBus.value.emit('auth-change');
      }
    };

    window.addEventListener('storage', handleStorageChange);

    eventBus.value.on('auth-change', () => {
      authStore.setAccessToken(null);
      router.push("/sign-in");
    });

    onBeforeUnmount(() => {
      window.removeEventListener('storage', handleStorageChange);
    });

    return {
      authReady
    };
  }
};
</script>

<style>
html,
body,
#app {
  height: 100%;
  margin: 0;
  width: 100%;
}
v-app {
  height: 100%;
  width: 100%;
}
</style>
