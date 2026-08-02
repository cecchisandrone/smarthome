import { createApp } from 'vue'
import { createRouter, createWebHashHistory } from 'vue-router'
import * as authService from 'src/services/authService.js'

// Plugins
import GlobalComponents from './globalComponents'
import Notifications from './components/UIComponents/NotificationPlugin'
import SideBar from './components/UIComponents/SidebarPlugin'
import App from './App.vue'

// router setup
import routes from './routes/routes'

// library imports
import Chartist from 'chartist'
import 'bootstrap/dist/css/bootstrap.css'
import './assets/sass/paper-dashboard.scss'

window['environment'] = process.env

// configure router
//
// Hash history, because vue-router 2 defaulted to it and every deployed link,
// e2e helper and nginx rule assumes '#/...'. Moving to createWebHistory() is a
// deployment change (nginx needs a try_files fallback), not a framework one, so
// it is deliberately kept out of this phase.
const router = createRouter({
  history: createWebHashHistory(),
  routes,
  linkActiveClass: 'active'
})
router.beforeEach((to, from, next) => {
  if (to.path === '/login' || authService.checkAuth()) {
    next()
  } else {
    next('/login')
  }
})

const app = createApp(App)

// plugin setup
app.use(router)
app.use(GlobalComponents)
app.use(Notifications)
app.use(SideBar)

// global library setup. Vue 2 reached Chartist through a $root data property
// and a prototype getter; a global property is the direct equivalent.
app.config.globalProperties.$Chartist = Chartist

app.mount('#app')
