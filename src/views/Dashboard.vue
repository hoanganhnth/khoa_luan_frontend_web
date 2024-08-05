<template>
    <div class="dashboard">
      <Sidebar />
      <div class="main">
        <Navbar />
        <DashboardContent />
      </div>
    </div>
  </template>
  
  <script setup>
  import Sidebar from '../components/Sidebar.vue';
  import Navbar from '../components/Navbar.vue';
  import DashboardContent from '../components/DashboardContent.vue';
  </script>
  
  <style scoped>
  .dashboard {
    display: flex;
  }
  
  .main {
    flex: 1;
    display: flex;
    flex-direction: column;
  }
  </style>