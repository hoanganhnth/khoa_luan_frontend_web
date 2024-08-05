import { createRouter, createWebHistory } from "vue-router";
import Dashboard from "../views/Dashboard.vue";
import Home from "../views/Home.vue";
import Profile from "../views/Profile.vue";
import Settings from "../views/Setting.vue";

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
    component: Dashboard,
    children: [
      {
        path: "home",
        component: Home,
      },
      {
        path: "profile",
        component: Profile,
      },
      {
        path: "settings",
        component: Settings,
      },
    ],
  },
];

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

export default router;
