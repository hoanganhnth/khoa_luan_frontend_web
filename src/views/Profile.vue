<template>
  <div>
    <!-- Nút Thêm Công Ty với màu nền trắng và margin dưới cùng -->
    <a-button
      type="primary"
      @click="showAddModal"
      style="
        background-color: white;
        border-color: #1890ff;
        color: #1890ff;
        margin-bottom: 16px;
      "
    >
      Thêm Công Ty
    </a-button>
    <div v-if="loading">Đang tải dữ liệu...</div>
    <!-- Danh sách công ty -->
    <a-row :gutter="[24, 24]">
      <a-col v-for="company in companies" :key="company.id" :span="8">
        <a-card :title="company.name" :hoverable="true">
          <p><strong>Địa chỉ:</strong> {{ company.address }}</p>
          <p><strong>Email:</strong> {{ company.email || "Chưa cung cấp" }}</p>
          <p><strong>Số điện thoại:</strong> {{ company.phone }}</p>
          <p>
            <strong>Mã số thuế:</strong>
            {{ company.code_tax || "Chưa cung cấp" }}
          </p>
          <p>
            <strong>Trạng thái: </strong>
            <span
              :class="company.status === 'pending' ? 'pending' : 'verified'"
            >
              {{ company.status }}
            </span>
          </p>
          <div class="button-group">
            <!-- <a-button v-if="company.status === 'pending'" class="pending-button">Chưa xác thực</a-button> -->
            <a-button @click="editCompany(company)" class="edit-button"
              >Chỉnh sửa</a-button
            >
            <a-button
              @click="confirmDeleteCompany(company.id)"
              class="delete-button"
              >Xóa</a-button
            >
          </div>
        </a-card>
      </a-col>
    </a-row>

    <!-- Modal Chỉnh Sửa -->
    <a-modal
      v-model:open="isModalVisible"
      :title="modalTitle"
      @ok="handleOk"
      @cancel="handleCancel"
    >
      <a-form :model="formState" name="companyForm" layout="vertical">
        <a-form-item
          label="Tên Công Ty"
          name="name"
          :rules="[{ required: true, message: 'Vui lòng nhập tên công ty!' }]"
        >
          <a-input v-model:value="formState.name" />
        </a-form-item>

        <a-form-item
          label="Địa Chỉ"
          name="address"
          :rules="[{ required: true, message: 'Vui lòng nhập địa chỉ!' }]"
        >
          <a-input v-model:value="formState.address" />
        </a-form-item>

        <a-form-item
          label="Email"
          name="email"
          :rules="[
            {
              type: 'email',
              required: true,
              message: 'Vui lòng nhập email hợp lệ!',
            },
          ]"
        >
          <a-input v-model:value="formState.email" />
        </a-form-item>

        <a-form-item
          label="Số Điện Thoại"
          name="phone"
          :rules="[{ required: true, message: 'Vui lòng nhập số điện thoại!' }]"
        >
          <a-input v-model:value="formState.phone" />
        </a-form-item>
        <a-form-item label="Mã Số Thuế" name="code_tax">
          <a-input v-model:value="formState.code_tax" />
        </a-form-item>
        <a-form-item label="Ảnh Công Ty" name="image">
          <input type="file" @change="handleFileChange" />
          <img
            v-if="formState.imagePreview"
            :src="formState.imagePreview"
            alt="Preview"
            style="width: 100%; height: auto; margin-top: 8px"
          />
        </a-form-item>
      </a-form>
    </a-modal>
    <ConfirmDeleteModal
      ref="confirmDeleteModal"
      :modalTitle="modalTitleDelete"
      :modalContent="modalContentDelete"
    />
  </div>
</template>

<script setup>
import { defineComponent, ref, onMounted } from "vue";
import { useCompanyStore } from "../stores/company";
import { useAuthStore } from "../stores/auth";
import { notification } from "ant-design-vue";
import ConfirmDeleteModal from "../components/ConfirmDeleteModal.vue"; // Import component

const companyStore = useCompanyStore();
const authStore = useAuthStore();
const isModalVisible = ref(false);
const isEditing = ref(false);
const companies = ref([]);
const formState = ref({
  id: null,
  name: "",
  address: "",
  email: "",
  phone: "",
  code_tax: "",
  image: null,
  imagePreview: null,
});
const modalTitleDelete = ref("");
const modalContentDelete = ref("");
const modalTitle = ref("Chỉnh sửa Công Ty");
const loading = ref(true);
const confirmDeleteModal = ref(null); // Define ref for modal component

const openNotification = (title, content) => {
  notification.open({
    message: title,
    description: content,
    onClick: () => {
      console.log("Notification Clicked!");
    },
  });
};

const fetchCompanies = async () => {
  try {
    await companyStore.fetchCompany({ user_id: authStore.userDetail.id });
    loading.value = false;
    companies.value = companyStore.companies;
  } catch (error) {
    loading.value = false;
    console.error("Error fetching companies:", error);
    openNotification("Thất bại!", "Lấy danh sách công ty thất bại");
  }
};

const editCompany = (company) => {
  formState.value = { ...company };
  isEditing.value = true;
  isModalVisible.value = true;
  modalTitle.value = "Chỉnh sửa Công Ty";
};

const deleteCompany = async (companyId) => {
  try {
    await companyStore.deleteCompany(companyId);
    openNotification("Thành công!", "Xóa công ty thành công");
    await fetchCompanies();
  } catch (error) {
    console.error("Error deleting company:", error);
    openNotification("Thất bại!", "Xóa công ty thất bại");
  }
};

const confirmDeleteCompany = (companyId) => {
  if (confirmDeleteModal.value) {
    modalTitleDelete.value = "Xóa công ty";
    modalContentDelete.value = `Bạn có chắc chắn muốn xóa công ty có ID ${companyId}?`;
    confirmDeleteModal.value.showModal(() => deleteCompany(companyId));
  } else {
    console.error("confirmDeleteModal is not initialized");
  }
};

const showAddModal = () => {
  formState.value = {
    id: null,
    name: "",
    address: "",
    email: "",
    phone: "",
  };
  isEditing.value = false;
  modalTitle.value = "Thêm Công Ty";
  isModalVisible.value = true;
};

const statusClass = (status) => {
  return status === "pending"
    ? "pending"
    : status === "accepted"
    ? "accepted"
    : "rejected";
};

const statusText = (status) => {
  switch (status) {
    case "pending":
      return "Chưa xác thực";
    case "accepted":
      return "Đã xác thực";
    case "rejected":
      return "Bị từ chối";
    default:
      return "";
  }
};

const handleFileChange = (event) => {
  const file = event.target.files[0];
  if (file) {
    formState.value.image = file;
    const reader = new FileReader();
    reader.onload = (e) => {
      formState.value.imagePreview = e.target.result;
    };
    reader.readAsDataURL(file);
  }
};

const handleOk = async () => {
  const formData = new FormData();
  Object.keys(formState.value).forEach((key) => {
    if (key !== "imagePreview") {
      formData.append(key, formState.value[key]);
    }
  });
  if (isEditing.value) {
    try {
      await companyStore.updateCompany(formState.value);
      await fetchCompanies();
      openNotification("Thành công!", "Cập nhật công ty thành công");
    } catch (error) {
      console.error("Error updating company:", error);
      openNotification("Thất bại!", "Cập nhật công ty thất bại");
    }
  } else {
    try {
      await companyStore.addCompany(formState.value);
      await fetchCompanies();
      openNotification("Thành công!", "Thêm công ty thành công");
    } catch (error) {
      console.error("Error adding company:", error);
      openNotification("Thất bại!", "Thêm công ty thất bại");
    }
  }
  isModalVisible.value = false;
};

const handleCancel = () => {
  isModalVisible.value = false;
};

// Fetch companies data when the component is mounted
onMounted(() => {
  fetchCompanies();
});
</script>

<style scoped>
.pending {
  color: red;
  font-weight: bold;
}

.accepted {
  color: green;
  font-weight: bold;
}

.rejected {
  color: gray;
  font-weight: bold;
}
.pending-button {
  background-color: #f5f5f5; /* Nền xám nhạt cho nút chưa xác thực */
  color: #ff4d4f; /* Màu chữ đỏ cho nổi bật */
  border-color: #ff4d4f; /* Màu biên đỏ */
}

.edit-button {
  margin-right: 8px; /* Khoảng cách giữa các nút */
}

.delete-button {
  margin-left: 8px; /* Khoảng cách giữa các nút */
}

.button-group {
  margin-top: 16px; /* Khoảng cách giữa nội dung card và nhóm nút */
}
</style>
