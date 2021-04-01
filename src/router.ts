import { createWebHistory, createRouter } from "vue-router";

const history = createWebHistory();

const router = createRouter({
  history,
  routes: [
    {
      path: "/",
      redirect: "/main",
    },
    {
      path: "/main",
      component: () => import("./pages/Home.vue"),
      meta: {
        requireAuth: true,
        title: "Home Page - Tabungan App",
        metaTags: [
          {
            name: "description",
            content: "The home page of our example app.",
          },
          {
            property: "og:description",
            content: "The home page of our example app.",
          },
        ],
      },

      children: [
        {
          path: "",
          redirect: "/main/dashboard",
        },
        {
          path: "dashboard",
          name: "Dashboard",
          component: () => import("./pages/home/Dashboard.vue"),
          meta: {
            title: "Beranda",
          },
        },
        {
          path: "history",
          name: "History",
          component: () => import("./pages/home/History.vue"),
          meta: {
            title: "Daftar Tabungan",
          },
        },
        {
          path: "profil",
          name: "Profil",
          component: () => import("./pages/home/Profil.vue"),
          meta: {
            title: "Profil Saya",
          },
        },
      ],
    },
    {
      path: "/detail/:id",
      name: "Detail",
      component: () => import("./pages/DetailDeposit.vue"),
      meta: {
        title: "Detail Tabungan",
      },
    },
    {
      path: "/deposit",
      name: "Deposit",
      component: () => import("./pages/FormSaving.vue"),
      meta: {
        requireAuth: true,
        title: "Home Page - Tabungan App",
        metaTags: [
          {
            name: "description",
            content: "The home page of our example app.",
          },
          {
            property: "og:description",
            content: "The home page of our example app.",
          },
        ],
      },
    },
    {
      path: "/create",
      name: "CreateSaving",
      component: () => import("./pages/CreateSaving.vue"),
      meta: {
        requireAuth: true,
        title: "Home Page - Tabungan App",
        metaTags: [
          {
            name: "description",
            content: "The home page of our example app.",
          },
          {
            property: "og:description",
            content: "The home page of our example app.",
          },
        ],
      },
    },
    {
      path: "/login",
      name: "Login",
      component: () => import("./pages/Login.vue"),
      meta: {
        title: "Home Page - Tabungan App",
        metaTags: [
          {
            name: "description",
            content: "The home page of our example app.",
          },
          {
            property: "og:description",
            content: "The home page of our example app.",
          },
        ],
      },
    },
  ],
});
export default router;
