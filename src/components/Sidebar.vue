<template>
  <div class="sidebar">
    <router-link to="/dashboard/home">Home</router-link>
    <router-link to="/dashboard/profile">Profile</router-link>
    <router-link to="/dashboard/settings">Settings</router-link>
  </div>
</template>

<style scoped>
.sidebar {
  width: 200px;
  height: 100vh;
  background-color: #f4f4f4;
  padding: 20px;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
}

.sidebar a {
  display: block;
  margin-bottom: 10px;
  color: #333;
  text-decoration: none;
}

.sidebar a.router-link-active {
  font-weight: bold;
  color: #007bff;
}
</style>