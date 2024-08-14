<template>
  <div class="applicant-container">
    <a-card
      v-for="applicant in applicants"
      :key="applicant.id"
      class="applicant-card"
    >
      <a-card-meta
        :title="applicant.email"
        :description="'Trạng thái: ' + getStatusText(applicant.status)"
      />
      <p>Applied At: {{ applicant.applied_at }}</p>
      <a-button
        @click="viewCV(applicant.resume_url)"
        type="primary"
        style="margin-right: 8px"
        >Xem CV</a-button
      >
      <a-select
        v-model:value="applicant.status"
        @change="updateStatus(applicant.id, $event)"
      >
        <a-select-option value="pending">Đã gửi</a-select-option>
        <a-select-option value="accepted">Đã chấp nhận</a-select-option>
        <a-select-option value="rejected">Từ chối</a-select-option>
      </a-select>
    </a-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { notification } from "ant-design-vue";
import { useJobStore } from "../stores/job";

const route = useRoute();
const jobStore = useJobStore();
const applicants = ref([]);

const fetchApplicants = async () => {
  try {
    const response = await jobStore.fetchJobAplication(route.params.jobId);
    applicants.value = response.data;
  } catch (error) {
    console.error("Error fetching applicants:", error);
  }
};

const viewCV = (resumeUrl) => {
  if (resumeUrl) {
    window.open(resumeUrl, "_blank");
  } else {
    notification.info({ message: "No CV available" });
  }
};
const getStatusText = (status) => {
  const statusMapping = {
    pending: "Đã gửi",
    accepted: "Đã chấp nhận",
    rejected: "Từ chối",
  };
  return statusMapping[status] || "Unknown";
};
const updateStatus = async (applicantId, status) => {
  try {
    // Ensure status values are mapped correctly
    const statusMapping = {
      "Đã gửi": "PENDING",
      "Đã chấp nhận": "ACCEPT",
      "Từ chối": "REJECT",
    };
    const statusValue = statusMapping[status];
    await jobStore.updateApplicantStatus(applicantId, statusValue);
    fetchApplicants(); // Refresh the list
  } catch (error) {
    console.error("Error updating applicant status:", error);
  }
};

onMounted(() => {
  fetchApplicants();
});
</script>

<style scoped>
.applicant-container {
  display: flex;
  flex-wrap: wrap;
  gap: 16px; /* Adjust spacing between items as needed */
}

.applicant-card {
  flex: 1 1 calc(33.333% - 16px); /* Adjust the width of each card, subtracting gap to fit three per row */
  box-sizing: border-box; /* Ensure padding and borders are included in the width */
}
</style>
