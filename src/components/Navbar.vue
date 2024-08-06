<template>
  <div class="navbar">
    <div class="navbar-right">
      <button @click="logout">Logout</button>
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from "../stores/auth";
import { useRouter } from "vue-router";
import { notification } from 'ant-design-vue';


const openNotification = (title, content) => {
      notification.open({
        message: title,
        description: content,
        onClick: () => {
          console.log("Notification Clicked!");
        },
      });
    };
const router = useRouter();
const logout = async () => {
  try {
    await useAuthStore().logout();
    console.log("Logout successful:");
    router.push("/sign-in");
    openNotification("Success", "Đăng xuất thành công");
  } catch (error) {
    openNotification("Thất bại!", "Đăng xuất thất bại");
    console.error("Login failed:", error.message);
  }
  // Logic để logout
};
</script>

<style scoped>
.navbar {
  display: flex;
  justify-content: flex-end;
  background-color: #333;
  padding: 10px;
  color: #fff;
}

.navbar-right {
  display: flex;
  align-items: center;
}
</style>
