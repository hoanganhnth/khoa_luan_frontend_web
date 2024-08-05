<template>
    <div class="navbar">
      <div class="navbar-right">
        <button @click="logout">Logout</button>
      </div>
    </div>
  </template>
  
  <script setup>
  const logout = () => {
    console.log("Logout");
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