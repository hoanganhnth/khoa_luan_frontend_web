import { defineStore } from "pinia";
import { useApi, useApiPrivate } from "../composables/useApi";
import { APIEndpoints } from "@/utils/api_constants";

export const useJobStore = defineStore("job", {
  state: () => ({
    jobs: [],
    totalPages: 0,
    currentPage: 1,
  }),

  actions: {
    async fetchJobs(payload, currentPage, pageSize) {
      try {
        const response = await useApi().post(APIEndpoints.JOB_FETCH, {
          user_id: payload,
          page: currentPage,
          size: pageSize,
        });
        const { data } = response;
        if (data.status === 1) {
          this.jobs = data.data.jobs;
          return response.data;
        } else {
          throw new Error("Unexpected response format");
        }
      } catch (error) {
        console.error("Failed to fetch job data:", error);
        throw error;
      }
    },

    async addJob(job) {
      try {
        const response = await useApiPrivate().post(
          APIEndpoints.JOB_CREATE,
          job
        );
        if (response.data && response.data.status === 1) {
          //   this.jobs.push(response.data.data);
        } else {
          throw new Error("Unexpected response format");
        }
      } catch (error) {
        console.error("Failed to add job:", error);
        throw error;
      }
    },

    async updateJob(job) {
      try {
        const response = await useApiPrivate().post(
          APIEndpoints.JOB_UPDATE,
          job
        );
        if (response.data && response.data.status === 1) {
          //   const index = this.jobs.findIndex((j) => j.id === job.id);
          //   if (index !== -1) {
          //     this.jobs[index] = response.data.data;
          //   }
          return true;
        } else {
          throw new Error("Unexpected response format");
        }
      } catch (error) {
        console.error("Failed to update job:", error);
        throw error;
      }
    },

    async deleteJob(jobId) {
      try {
        const response = await useApiPrivate().post(APIEndpoints.JOB_DELETE, {
          job_id: jobId,
        });
        if (response.data && response.data.status === 1) {
          //   this.jobs = this.jobs.filter((job) => job.id !== jobId);
          return true;
        } else {
          throw new Error("Unexpected response format");
        }
      } catch (error) {
        console.error("Failed to delete job:", error);
        throw error;
      }
    },
    async fetchLocations() {
      try {
        const response = await useApiPrivate().get(APIEndpoints.LOCATION_FETCH);
        if (response.data && response.data.status === 1) {
          //   this.jobs = this.jobs.filter((job) => job.id !== jobId);
          return response.data;
        } else {
          throw new Error("Unexpected response format");
        }
      } catch (error) {
        console.error("Failed to delete job:", error);
        throw error;
      }
    },
    async fetchIndustries() {
      try {
        const response = await useApiPrivate().get(APIEndpoints.INDUSTRY_FETCH);
        if (response.data && response.data.status === 1) {
          //   this.jobs = this.jobs.filter((job) => job.id !== jobId);
          return response.data;
        } else {
          throw new Error("Unexpected response format");
        }
      } catch (error) {
        console.error("Failed to delete job:", error);
        throw error;
      }
    },
    async updateApplicantStatus(status, jobApplication_id) {
      try {
        // Define the payload with status and jobApplication_id
        const payload = {
          status: status,
          jobApplication_id: jobApplication_id,
        };

        // Call the API to update the job application status
        const response = await useApiPrivate().post(
          APIEndpoints.JOB_APPLICATION_UPDATE,
          payload
        );

        // Check if the response is successful and has the expected format
        if (response.data && response.data.status === 1) {
          return true; // Update successful
        } else {
          throw new Error("Unexpected response format or update failed");
        }
      } catch (error) {
        console.error("Failed to update job application:", error);
        throw error; // Re-throw error to be handled by caller
      }
    },
    async fetchJobAplication(job_id) {
      try {
        const response = await useApi().post(
          APIEndpoints.JOB_APPLICATION_FETCH,
          {
            job_id: job_id,
          }
        );
        const { data } = response;
        if (data.status === 1) {
          // return response.data;
          return {
            status: 1,
            message: "Success",
            data: [
              {
                id: 1,
                job_id: 13,
                user_id: 11,
                status: "pending",
                applied_at: "2024-07-15T18:04:27.000Z",
                cover_letter: "Xin chao",
                resume_url: null,
                email_candidate: null,
                createdAt: "2024-07-15T18:04:27.000Z",
                updatedAt: "2024-07-17T18:09:43.000Z",
              },
              {
                id: 2,
                job_id: 4,
                user_id: 11,
                status: "pending",
                applied_at: "2024-07-15T18:04:27.000Z",
                cover_letter: "Xin chao",
                resume_url: null,
                email_candidate: null,
                createdAt: "2024-07-15T18:04:27.000Z",
                updatedAt: "2024-07-17T18:09:43.000Z",
              },
              {
                id: 3,
                job_id: 4,
                user_id: 11,
                status: "pending",
                applied_at: "2024-07-15T18:04:27.000Z",
                cover_letter: "Xin chao",
                resume_url: null,
                email_candidate: null,
                createdAt: "2024-07-15T18:04:27.000Z",
                updatedAt: "2024-07-17T18:09:43.000Z",
              },
              {
                id: 4,
                job_id: 4,
                user_id: 11,
                status: "accepted",
                applied_at: "2024-07-15T18:04:27.000Z",
                cover_letter: "Xin chao",
                resume_url: null,
                email_candidate: null,
                createdAt: "2024-07-15T18:04:27.000Z",
                updatedAt: "2024-07-17T18:09:43.000Z",
              },
              {
                id: 5,
                job_id: 4,
                user_id: 11,
                status: "accepted",
                applied_at: "2024-07-15T18:04:27.000Z",
                cover_letter: "Xin chao",
                resume_url: null,
                email_candidate: null,
                createdAt: "2024-07-15T18:04:27.000Z",
                updatedAt: "2024-07-17T18:09:43.000Z",
              },
            ],
          };
        } else {
          throw new Error("Unexpected response format");
        }
      } catch (error) {
        console.error("Failed to fetch job application data:", error);
        throw error;
      }
    },
  },
});
