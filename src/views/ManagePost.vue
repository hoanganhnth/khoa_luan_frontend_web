<template>
  <div>
    <a-button
      type="primary"
      @click="showAddModal"
      style="
        background-color: white;
        border-color: #1890ff;
        color: #1890ff;
        margin-bottom: 16px;
      "
      >Thêm Bài Tuyển Dụng</a-button
    >

    <a-table
      :columns="columns"
      :data-source="jobs"
      :scroll="{ x: 1300, y: 1000 }"
      :pagination="paginationConfig"
      @change="handleTableChange"
    >
      <template v-slot:bodyCell="{ column, record }">
        <template v-if="column.key === 'operation'">
          <a-button
            @click="editJob(record)"
            type="primary"
            style="margin-right: 8px; color: white"
            >Sửa</a-button
          >
          <a-button
            @click="confirmDeleteJob(record.id)"
            type="danger"
            style="color: red"
            >Xóa</a-button
          >
        </template>
        <template v-else-if="column.key === 'status'">
          <span :class="getStatusClass(record.status)">
            {{ record.status === "active" ? "Kích hoạt" : "Không kích hoạt" }}
          </span>
        </template>
        <template v-else-if="column.key === 'applicants'">
          <span>{{ record.number_applied }}</span>
          <a @click="showApplicants(record)" style="margin-left: 8px; cursor: pointer; color: #1890ff;">
            Xem
          </a>
        </template>
        <template v-else>
          {{ record[column.dataIndex] }}
        </template>
      </template>
      <template v-slot:headerCell="{ column }">
        {{ column.title }}
      </template>
    </a-table>

    <!-- Modal thêm/sửa bài tuyển dụng -->
    <a-modal
      v-model:open="isModalVisible"
      :title="modalTitle"
      @ok="handleSave"
      @cancel="handleCancel"
    >
      <a-form :form="form" layout="vertical">
        <a-form-item label="Tiêu Đề">
          <a-input v-model:value="formData.title" />
        </a-form-item>
        <a-form-item label="Mô Tả">
          <a-textarea v-model:value="formData.description" />
        </a-form-item>
        <a-form-item label="Địa Điểm">
          <a-select v-model:value="formData.location_id">
            <a-select-option
              v-for="location in locations"
              :key="location.id"
              :value="location.id"
              >{{ location.country }}</a-select-option
            >
          </a-select>
        </a-form-item>
        <a-form-item label="Lương">
          <a-input v-model:value="formData.salary" />
        </a-form-item>
        <a-form-item label="Ngành Nghề">
          <a-select v-model:value="formData.industry_id">
            <a-select-option
              v-for="industry in industries"
              :key="industry.id"
              :value="industry.id"
              >{{ industry.name }}</a-select-option
            >
          </a-select>
        </a-form-item>
        <a-form-item label="Thời Gian Làm Việc">
          <a-input v-model:value="formData.working_time" />
        </a-form-item>
        <a-form-item label="Ngày Hết Hạn">
          <a-date-picker v-model:value="formData.expires_at" />
        </a-form-item>
        <a-form-item label="Số Ứng Viên">
          <a-input-number v-model:value="formData.number_candidates" />
        </a-form-item>
        <a-form-item label="Trạng Thái">
          <a-select v-model:value="formData.status">
            <a-select-option value="active">Active</a-select-option>
            <a-select-option value="inactive">Inactive</a-select-option>
          </a-select>
        </a-form-item>
      </a-form>
    </a-modal>

    <!-- Confirm Delete Modal -->
    <a-modal
      v-model:open="isConfirmDeleteVisible"
      title="Xác Nhận Xóa"
      @ok="handleDelete"
      @cancel="handleConfirmCancel"
    >
      <p>Bạn có chắc chắn muốn xóa bài tuyển dụng này không?</p>
    </a-modal>

    <!-- Pagination Controls -->
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { notification } from "ant-design-vue";
import { useJobStore } from "../stores/job";
import { useAuthStore } from "../stores/auth";
import { UserOutlined } from '@ant-design/icons-vue';
import dayjs from "dayjs";
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const jobStore = useJobStore();
const isModalVisible = ref(false);
const isConfirmDeleteVisible = ref(false);
const modalTitle = ref("Thêm Bài Tuyển Dụng");
const formData = ref({
  company_id: 2,
  title: "",
  description: "",
  location_id: null,
  salary: null,
  industry_id: null,
  working_time: "",
  expires_at: null,
  number_candidates: null,
  status: "active",
  number_applied: 0,
});
const form = ref(null);
const jobs = ref([]);
const locations = ref([]);
const industries = ref([]);
const selectedJobId = ref(null);
const dateFormat = "YYYY-MM-DD";
const paginationConfig = ref({
  current: 1,
  pageSize: 10,
  total: 0,
  showSizeChanger: true,
  pageSizeOptions: ["10", "20", "50", "100"],
});
const router = useRouter();
const columns = [
  {
    title: "Tiêu Đề",
    dataIndex: "title",
    key: "title",
  },
  {
    title: "Mô Tả",
    dataIndex: "description",
    key: "description",
  },
  {
    title: "Lương",
    dataIndex: "salary",
    key: "salary",
  },
  {
    title: "Số Người Apply", // New Applicants Column
    key: "applicants",
    dataIndex: "number_applied",
  },
  {
    title: "Trạng Thái", // New Status Column
    key: "status",
    dataIndex: "status",
  },
  {
    title: "Thao Tác",
    key: "operation",
    slots: { customRender: "bodyCell" },
  },
];

const showApplicants = (job) => {
  router.push({ name: 'JobApplicants', params: { jobId: job.id } });
};
const getStatusClass = (status) => {
  return status === "active" ? "text-active" : "text-inactive";
};
const showAddModal = () => {
  modalTitle.value = "Thêm Bài Tuyển Dụng";
  formData.value = {
    company_id: 15,
    title: "",
    description: "",
    location_id: null,
    salary: null,
    industry_id: null,
    working_time: "",
    expires_at: null,
    number_candidates: null,
    status: "active",
    number_applied: 0,
  };
  isModalVisible.value = true;
};

const editJob = (job) => {
  modalTitle.value = "Sửa Bài Tuyển Dụng";
  formData.value = {
    ...job,
    expires_at: job.expires_at ? dayjs(job.expires_at) : null,
  };
  isModalVisible.value = true;
};

const handleSave = async () => {
  try {
    const jobToSave = {
      ...formData.value,
      expires_at: formData.value.expires_at
        ? formData.value.expires_at.format(dateFormat)
        : null,
    };
    if (modalTitle.value === "Thêm Bài Tuyển Dụng") {
      await jobStore.addJob(jobToSave);
      notification.success({ message: "Thêm thành công!" });
    } else {
      await jobStore.updateJob(jobToSave);
      notification.success({ message: "Sửa thành công!" });
    }
    isModalVisible.value = false;
    fetchJobsData(); // Refresh the job list
  } catch (error) {
    notification.error({
      message: "Lỗi!",
      description: "Có lỗi xảy ra khi lưu dữ liệu.",
    });
  }
};

const handleTableChange = (pagination) => {
  fetchJobsData(pagination.current, pagination.pageSize);
};

const handleCancel = () => {
  isModalVisible.value = false;
};

const confirmDeleteJob = (id) => {
  selectedJobId.value = id;
  isConfirmDeleteVisible.value = true;
};

const handleDelete = async () => {
  try {
    await jobStore.deleteJob(selectedJobId.value);
    notification.success({ message: "Xóa thành công!" });
    isConfirmDeleteVisible.value = false;
    fetchJobsData(); // Refresh the job list
  } catch (error) {
    notification.error({
      message: "Lỗi!",
      description: "Có lỗi xảy ra khi xóa dữ liệu.",
    });
  }
};

const handleConfirmCancel = () => {
  isConfirmDeleteVisible.value = false;
};

const fetchJobsData = async (page = 1, pageSize = 10) => {
  try {
    const response = await jobStore.fetchJobs(
      authStore.userDetail.id,
      page,
      pageSize
    );
    jobs.value = response.data.jobs; // Adjust according to your API response structure
    paginationConfig.value.total = response.data.totalItems;
    paginationConfig.value.current = page;
    paginationConfig.value.pageSize = pageSize;
  } catch (error) {
    console.error("Error fetching jobs:", error);
  }
};

const fetchLocations = async () => {
  try {
    const response = await jobStore.fetchLocations();
    locations.value = response.data;
  } catch (error) {
    console.error("Error fetching locations:", error);
  }
};

const fetchIndustries = async () => {
  try {
    const response = await jobStore.fetchIndustries();
    industries.value = response.data;
  } catch (error) {
    console.error("Error fetching industries:", error);
  }
};

// Fetch job data, locations, and industries on component mount
onMounted(() => {
  fetchJobsData();
  fetchLocations();
  fetchIndustries();
});
</script>
