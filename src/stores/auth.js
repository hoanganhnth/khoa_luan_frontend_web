import { defineStore } from "pinia";
import { useApi, useApiPrivate } from "../composables/useApi";
import { APIEndpoints } from "@/utils/api_constants";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: {},
    accessToken: "",
    authReady: false,
  }),

  getters: {
    userDetail: (state) => state.user,
    isAuthenticated: (state) => !!state.accessToken,
  },

  actions: {
    setAccessToken(token) {
      this.accessToken = token;
      // Lưu token vào localStorage để giữ lại giữa các phiên làm việc
      localStorage.setItem("token", token);
      window.dispatchEvent(new Event('storage'));
    },
    getAccessToken() {
      console.log(this.accessToken);
    },
    
    setUser(user) {
      this.user = user;
    },

    setAuthReady(value) {
      this.authReady = value;
    },

    async attempt() {
      try {
        // await this.refresh();
        await this.getUser();
      } catch (error) {
        console.error("Error in attempt:", error);
        throw(error);
      }
    },

    async login(payload) {
      try {
        const response = await useApi().post(APIEndpoints.AUTH_LOGIN, payload);

        const { data } = response;

        if (data && data.status === 1) {
          const { accessToken, user } = data.data;

          this.setAccessToken(accessToken);

          this.setUser(user);
          localStorage.setItem("role", { user }.role);
          // await this.getUser();
          // this.setAuthReady(true);
          return data;
        } else {
          throw new Error("Unexpected response format");
        }
      } catch (error) {
        throw error;
      }
    },

    async register(payload) {
      try {
        const { data } = await useApi().post(
          APIEndpoints.AUTH_REGISTER,
          payload
        );
        return data;
      } catch (error) {
        throw error.message;
      }
    },

    async getUser() {
      try {
        const { data } = await useApiPrivate().get(APIEndpoints.AUTH_USER);
        if (data) {
          this.setUser(data);

          // await this.getUser();
          localStorage.setItem("role", { data }.role);
          // this.setAuthReady(true);
          return data;
        } else {
          throw new Error("Unexpected response format");
        }
        // this.setUser(data);
      } catch (error) {
        throw error.message;
      }
    },

    async logout() {
      try {
        await useApiPrivate().post(APIEndpoints.AUTH_LOGOUT);
        this.accessToken = "";
        this.user = {};
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        window.dispatchEvent(new Event('storage'));
      } catch (error) {
        console.error("Error in logout:", error);
        throw error.message;
      }
    },

    async refresh() {
      try {
        const { data } = await useApi().post(APIEndpoints.AUTH_REFRESH);
        this.setAccessToken(data.access_token);
        return data;
      } catch (error) {
        console.error("Error in refresh:", error);
        throw error.message;
      }
    },
  },
});
