import "./assets/main.css";

import { createApp } from "vue";
import { createPinia } from "pinia";
import { createVuetify } from "vuetify";
import App from "./App.vue";
import router from "./router";
// import bootstrap from "bootstrap/dist/js/bootstrap.bundle";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "vuetify/dist/vuetify.min.css";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap.bundle";
import Antd from "ant-design-vue";
import 'vuetify/styles';

const app = createApp(App);
app.use(createVuetify({}));
app.use(Antd);
app.use(createPinia());
app.use(router);
app.mount("#app");

// createApp(App)
//     .use(Antd)
//     .component("layout-default", DefaultLayout)
//     .component("layout-dashboard", DashboardLayout)
//     .component("layout-dashboard-rtl", DashboardRTLLayout)
//     .use(createPinia())
//     .use(router)
//     .mount("#app");
