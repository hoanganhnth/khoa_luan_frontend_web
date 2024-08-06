import { defineStore } from "pinia";
import { useApi, useApiPrivate } from "../composables/useApi";
import { APIEndpoints } from "@/utils/api_constants";

export const useCompanyStore = defineStore("company", {
  state: () => ({
    companies: [],
  }),

  actions: {
    async fetchCompany(payload) {
    //   if (this.companies.length === 0 || isUpdate) {
        try {
          const response = await useApi().post(
            APIEndpoints.COMPANY_FETCH,
            payload
          );
          const { data } = response;
          console.log(data);
          if (data.status === 1) {
            this.companies = data.data;
          } else {
            throw new Error("Unexpected response format");
          }
        } catch (error) {
          console.error("Failed to fetch company data:", error);
          throw error;
        }
    //   }
    },
    async addCompany(company) {
      try {
        const response = await useApiPrivate().post(
          APIEndpoints.COMPANY_CREATE,
          company
        );
        if (response.data && response.data.status === 1) {
          this.companies.push(response.data.data);
        } else {
          throw new Error("Unexpected response format");
        }
      } catch (error) {
        console.error("Failed to add company:", error);
        throw error;
      }
    },

    async updateCompany(company) {
      try {
        const response = await useApiPrivate().post(
          APIEndpoints.COMPANY_UPDATE,
          company
        );
        if (response.data && response.data.status === 1) {
        //   const index = this.companies.findIndex((c) => c.id === company.id);
        //   if (index !== -1) {
        //     this.companies[index] = response.data.data;
        //   }
        } else {
          throw new Error("Unexpected response format");
        }
      } catch (error) {
        console.error("Failed to update company:", error);
        throw error;
      }
    },

    async deleteCompany(companyId) {
      try {
        const response = await useApiPrivate().delete(APIEndpoints.COMPANY_DELETE, {
          id: companyId,
        });
        if (response.data && response.data.status === 1) {
          this.companies = this.companies.filter((c) => c.id !== companyId);
        } else {
          throw new Error("Unexpected response format");
        }
      } catch (error) {
        console.error("Failed to delete company:", error);
        throw error;
      }
    },
  },
});
