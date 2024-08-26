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

      <!-- Button to View CV -->
      <a-button
        @click="viewCV(applicant.resume_url)"
        type="primary"
        style="margin-right: 8px"
        >Xem CV</a-button
      >

      <!-- Select to Update Status -->
      <a-select
        v-model:value="applicant.status"
        @change="handleStatusChange(applicant.id, $event)"
        :disabled="isStatusDisabled(applicant.status)"
        style="margin-bottom: 8px; width: 120px"
      >
        <a-select-option value="pending" disabled>Đã gửi</a-select-option>
        <a-select-option value="accepted">Chấp nhận</a-select-option>
        <a-select-option value="rejected">Từ chối</a-select-option>
      </a-select>

      <!-- Conditional Rendering of Cover Letter Section -->
      <p v-if="applicant.cover_letter && applicant.cover_letter.trim() !== ''">
        Thư giới thiệu:
        <a
          @click="viewCoverLetter(applicant.cover_letter)"
          style="color: #1890ff; cursor: pointer"
          >Xem</a
        >
      </p>
    </a-card>

    <!-- Modal for Viewing Cover Letter -->
    <a-modal
      v-model:open="isCoverLetterVisible"
      footer="{null}"
      @cancel="isCoverLetterVisible = false"
    >
      <p>{{ selectedCoverLetter }}</p>
    </a-modal>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { Modal, notification } from "ant-design-vue";
import { useJobStore } from "../stores/job";

const route = useRoute();
const jobStore = useJobStore();
const applicants = ref([]);
const selectedCoverLetter = ref(""); // Track the selected cover letter
const isCoverLetterVisible = ref(false); // Control the visibility of the modal
const originalStatus = "pending";
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
    accepted: "Chấp nhận",
    rejected: "Từ chối",
  };
  return statusMapping[status] || "Unknown";
};

const handleStatusChange = (applicantId, newStatus) => {
  const applicant = applicants.value.find(a => a.id === applicantId);
  if (applicant) {

    if (newStatus === 'accepted' || newStatus === 'rejected') {
      Modal.confirm({
        title: 'Xác nhận thay đổi trạng thái',
        content: `Bạn có chắc chắn muốn thay đổi trạng thái của ứng viên này thành ${newStatus === 'accepted' ? 'Chấp nhận' : 'Từ chối'} không?`,
        okText: 'Xác nhận',
        cancelText: 'Hủy',
        onOk: async () => {
          try {
            await jobStore.updateApplicantStatus(newStatus, applicantId);
            // Fetch updated applicants data
            fetchApplicants();
            notification.success({ message: 'Cập nhật trạng thái thành công!' });
          } catch (error) {
            notification.error({ message: 'Cập nhật trạng thái thất bại!' });
            applicant.status = originalStatus;
          }
        },
        onCancel() {
        
          if (applicant) {
            applicant.status = originalStatus;
          }
        },
      });
    } else {
      // Directly update status if it's not 'accepted' or 'rejected'
      applicant.status = newStatus;
    }
  }
};
const viewCoverLetter = (coverLetter) => {
  selectedCoverLetter.value = coverLetter;
  isCoverLetterVisible.value = true; // Show the modal
};
const isStatusDisabled = (status) => {
  return status === 'accepted' || status === 'rejected';
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
