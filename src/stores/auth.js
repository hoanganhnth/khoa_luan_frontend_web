import { defineStore } from 'pinia';
import { useApi, useApiPrivate } from "../composables/useApi";
import { APIEndpoints } from '@/utils/api_constants';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: {},
    accessToken: '',
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
      localStorage.setItem('token', token);
    },

    setUser(user) {
      this.user = user;
    },

    setAuthReady(value) {
      this.authReady = value;
    },

    async attempt() {
      try {
        await this.refresh();
        await this.getUser();
      } catch (error) {
        console.error('Error in attempt:', error);
        return;
      }
    },

    async login(payload) {
        try {
          const response = await useApi().post(APIEndpoints.AUTH_LOGIN, payload);
      
          const { data } = response; 
      
          if (data && data.status === 0) {
            const { accessToken, user } = data.data;
      
            this.setAccessToken(accessToken);
      
            this.setUser(user);
      
            // await this.getUser();
      
            return data; 
          } else {
            throw new Error('Unexpected response format');
          }
        } catch (error) {
          throw error; 
        }
      },

    async register(payload) {
      try {
        const { data } = await useApi().post(APIEndpoints.AUTH_REGISTER, payload);
        return data;
      } catch (error) {
        throw error.message;
      }
    },

    async getUser() {
      try {
        const { data } = await useApiPrivate().post(APIEndpoints.AUTH_USER, {
          headers: {
            Authorization: 'Bearer ' + this.accessToken,
          },
        });
        this.setUser(data);
        localStorage.setItem('role', data.role);
        return data;
      } catch (error) {
        throw error.message;
      }
    },

    async logout() {
      try {
        await useApiPrivate().post(APIEndpoints.AUTH_LOGOUT);
        this.accessToken = '';
        this.user = {};
        localStorage.removeItem('token');
        localStorage.removeItem('role');
      } catch (error) {
        console.error('Error in logout:', error);
        throw error.message;
      }
    },

    async refresh() {
      try {
        const { data } = await useApi().post(APIEndpoints.AUTH_REFRESH);
        this.setAccessToken(data.access_token);
        return data;
      } catch (error) {
        console.error('Error in refresh:', error);
        throw error.message;
      }
    },
  },
});
