<template>
  <a-form
    :model="formState"
    v-bind="layout"
    name="nest-messages"
    :validate-messages="validateMessages"
    @finish="onFinish"
  >
    <a-form-item
      label="Tên đăng nhập"
      name="name"
      :rules="[{ required: true }]"
    >
      <a-input v-model:value="formState.name" />
    </a-form-item>
    <a-form-item
      name="email"
      label="Email"
      :rules="[{ type: 'email', required: true }]"
    >
      <a-input v-model:value="formState.email" />
    </a-form-item>

    <a-form-item name="password" label="Mật khẩu" :rules="[{ required: true }]">
      <a-input v-model:value="formState.password" />
    </a-form-item>
    <a-form-item
      name="phone"
      label="Số điện thoại"
      :rules="[{ required: true }]"
    >
      <a-textarea v-model:value="formState.phone" />
    </a-form-item>
    <a-form-item
      name="name_company"
      label="Tên công ty"
      :rules="[{ required: true }]"
    >
      <a-textarea v-model:value="formState.name_company" />
    </a-form-item>
    <a-form-item
      name="address_company"
      label="Địa chỉ công ty"
      :rules="[{ required: true }]"
    >
      <a-textarea v-model:value="formState.address_company" />
    </a-form-item>

    <a-form-item :wrapper-col="{ ...layout.wrapperCol, offset: 8 }">
      <a-button type="primary" html-type="submit">Đăng ký</a-button>
      <a-button type="default" class="mt-2">
        <router-link to="/sign-in">Đăng nhập</router-link>
      </a-button>
    </a-form-item>
  </a-form>
</template>

<script>
import { reactive } from "vue";
import { useAuthStore } from "../stores/auth";
import { useRouter } from "vue-router";
import { StringConstants } from "../utils/string_constants";
import { notification } from "ant-design-vue";

export default {
  setup() {
    const formState = reactive({
      name: "",
      email: "",
      password: "",
      phone: "",
      name_company: "",
      address_company: "",
    });

    const layout = {
      labelCol: {
        span: 9,
      },
      wrapperCol: {
        span: 15,
      },
    };
    const router = useRouter();

    const validateMessages = {
      required: "${label} is required!",
      types: {
        email: "${label} is not a valid email!",
      },
    };
    const openNotification = (title, content) => {
      notification.open({
        message: title,
        description: content,
        onClick: () => {
          console.log("Notification Clicked!");
        },
      });
    };
    const onFinish = async (values) => {
      try {
        console.log(values);
        const response = await useAuthStore().register({
          email: values.email,
          user_name: values.name,
          password: values.password,
          phone: values.phone,
          role: StringConstants.ROLE_RECRUITER,
          address_company: values.address_company,
          name_company: values.name_company,
        });
        console.log("Register successful:", response);

        router.push("/sign-in");
        openNotification("Success", "Đăng ký thành công");

        // Xử lý sau khi đăng nhập thành công
      } catch (error) {
        openNotification("Thất bại!", "Đăng ký thất bại");

        console.error("Login failed:", error.message);
      }
    };
    return {
      formState,
      layout,
      validateMessages,
      onFinish,
    };
  },
};
</script>

<style scoped>
/* Add padding to labels */
.ant-form-item-label {
  padding-right: 16px;
}
</style>
