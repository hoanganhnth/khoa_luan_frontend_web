<template>
  <v-app>
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
export default {
  computed: {
    layout() {
      return "layout-" + (this.$route.meta.layout || "default").toLowerCase();
    }
  }
}
</script>

<style>
html, body, #app {
  height: 100%;
  margin: 0;
  width: 100%;
}
v-app {
  height: 100%;
  width: 100%;
}
</style>