import { createRouter, createWebHistory } from "vue-router";
import Dashboard from "../views/Dashboard.vue";
import Home from "../views/Home.vue";
import Profile from "../views/Profile.vue";
import Settings from "../views/Setting.vue";
import { useAuthStore } from "@/stores/auth";
import ManageCV from "@/views/ManageCV.vue";
let routes = [
  {
    // will match everything
    path: "/:pathMatch(.*)*",
    component: () => import("../views/404.vue"),
  },

  {
    path: "/sign-in",
    name: "Sign-In",
    component: () => import("../views/Sign-In.vue"),
  },
  {
    path: "/sign-up",
    name: "Sign-Up",
    meta: {
      layoutClass: "layout-sign-up",
    },
    component: () => import("../views/Sign-Up.vue"),
  },
  {
    path: "/",
    redirect: "/dashboard/home",
  },
  {
    path: "/dashboard",
    redirect: "/dashboard/home",
  },
  {
    path: "/dashboard",

    component: Dashboard,
    children: [
      {
        path: "home",
        component: Home,
        name: "dashboard-home",
        meta: { requiresAuth: true },
      },
      {
        path: "profile",
        component: Profile,
        meta: { requiresAuth: true },
      },
      {
        path: "settings",
        component: Settings,
        meta: { requiresAuth: true },
      },
      {
        path: "manageCV",
        component: ManageCV,
        meta: { requiresAuth: true },
      },
    ],
  },
];
const router = createRouter({
  // mode: 'hash',
  // base: process.env.BASE_URL,
  history: createWebHistory("/"),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (to.hash) {
      return {
        selector: to.hash,
        behavior: "smooth",
      };
    }
    return {
      x: 0,
      y: 0,
      behavior: "smooth",
    };
  },
});

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();
  const isAuthenticated = authStore.isAuthenticated;

  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (!isAuthenticated) {
      next({ name: "Sign-In" });
    } else {
      next();
    }
  } else {
    next();

  }
});
// Adding layout property from each route to the meta
// object so it can be accessed later.a
function addLayoutToRoute(route, parentLayout = "default") {
  route.meta = route.meta || {};
  route.meta.layout = route.layout || parentLayout;

  if (route.children) {
    route.children = route.children.map((childRoute) =>
      addLayoutToRoute(childRoute, route.meta.layout)
    );
  }
  return route;
}

routes = routes.map((route) => addLayoutToRoute(route));

export default router;
