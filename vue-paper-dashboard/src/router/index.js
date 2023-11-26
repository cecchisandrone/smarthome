import Vue from "vue";
import VueRouter from "vue-router";
import routes from "./routes";
import * as authService from '@/services/authService.js'

Vue.use(VueRouter);

// configure router
const router = new VueRouter({
  routes, // short for routes: routes
  linkActiveClass: "active",
});

router.beforeEach((to, from, next) => {
  if (to.path === '/login' || authService.checkAuth()) {
    next()
  } else {
    next('/login')
  }
})

export default router;
