<template>
  <a-row type="flex" :gutter="[24, 24]" justify="space-around" align="middle" class="full-height">
    <a-col class="col-form">
      <a-form
        :model="formState"
        name="basic"
        :label-col="{ span: 8 }"
        :wrapper-col="{ span: 16 }"
        autocomplete="off"
        @finish="onFinish"
        @finishFailed="onFinishFailed"
      >
        <a-form-item
          label="Email"
          name="email"
          :rules="[{ required: true, message: 'Bạn chưa nhập gmail!' }]"
        >
          <a-input v-model:value="formState.email" />
        </a-form-item>

        <a-form-item
          label="Mật khẩu"
          name="password"
          :rules="[{ required: true, message: 'Bạn chưa nhập password!' }]"
        >
          <a-input-password v-model:value="formState.password" />
        </a-form-item>

        <a-form-item :wrapper-col="{ offset: 8, span: 16 }">
          <a-button type="primary" html-type="submit">Đăng nhập</a-button>
          <a-button type="default" class="mt-2">
            <router-link to="/sign-up">Đăng ký</router-link>
          </a-button>
        </a-form-item>
      </a-form>
    </a-col>

    <!-- <a-col :span="24" :md="12" :lg="12" :xl="12" class="col-img">
    <img src="/images/img-signin.jpg" alt="" />
    </a-col> -->
  </a-row>
</template>

<script setup>
import { reactive } from "vue";
import { useAuthStore } from "../stores/auth";
import { useRouter } from 'vue-router';
import {StringConstants} from '../utils/string_constants'
import { notification } from 'ant-design-vue';
const formState = reactive({
  email: "",
  password: "",
  remember: true,
});
const router = useRouter();
const openNotification = (title, content) => {
  notification.open({
    message: title,
    description:
    content,
    onClick: () => {
      console.log('Notification Clicked!');
    },
  });
};
const onFinish = async (values) => {
  try {
    const response = await useAuthStore().login({
      email: values.email,
      password: values.password,
      role: StringConstants.ROLE_RECRUITER
    });
    console.log('Login successful:', response.data);
    router.push('/dashboard');
    openNotification("Success", "Đăng nhập thành công");
    // Xử lý sau khi đăng nhập thành công
  } catch (error) {
    openNotification("Thất bại!", "Đăng nhập thất bại");
    console.error('Login failed:', error.message);
  }
};
const onFinishFailed = (errorInfo) => {
  console.log("Failed:", errorInfo);
};
</script>

<style scoped>
.col-img img {
  width: 100%;
  max-width: 500px;
  margin: auto;
  display: block;

  @media (min-width: 992px) {
    margin: 0;
  }
}
.mt-2 {
  margin-top: 8px;
}
.full-height {
  height: 100vh; /* Chiếm toàn bộ chiều cao của viewport */
}
</style>
