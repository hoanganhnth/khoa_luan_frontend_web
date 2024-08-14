<!-- ConfirmDeleteModal.vue -->
<template>
    <a-modal v-model:open="open" :title="modalTitle" @ok="handleOk" @cancel="handleCancel">
      <p>{{ modalContent }}</p>
    </a-modal>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  
  // Không cần nhập khẩu defineProps và defineExpose
  const props = defineProps({
    modalTitle: {
      type: String,
      default: 'Confirm Deletion',
    },
    modalContent: {
      type: String,
      default: 'Are you sure you want to delete this company?',
    },
  });
  
  const open = ref(false);
  const onConfirm = ref(null);
  
  const showModal = (confirmCallback) => {
    open.value = true;
    onConfirm.value = confirmCallback;
  };
  
  const handleOk = () => {
    if (onConfirm.value) {
      onConfirm.value();
    }
    open.value = false;
  };
  
  const handleCancel = () => {
    open.value = false;
  };
  
  // Sử dụng defineExpose để lộ hàm showModal
  defineExpose({
    showModal,
  });
  </script>
  
  <style scoped>
  /* Add any styles you need for your modal */
  </style>
  