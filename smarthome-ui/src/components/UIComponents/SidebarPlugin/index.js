import { reactive } from 'vue'
import Sidebar from './SideBar.vue'

/**
 * Vue 2 made this reactive by injecting it into every component's data() via a
 * global mixin. Vue 3 drops the mixin: the store is reactive in its own right
 * and reaches templates through a single global property.
 */
const SidebarStore = reactive({
  showSidebar: false,
  sidebarLinks: [
    {
      name: 'Dashboard',
      icon: 'ti-panel',
      path: '/admin/overview'
    },
    {
      name: 'Cameras',
      icon: 'ti-video-camera',
      path: '/admin/cameras'
    },
    {
      name: 'Inverters',
      icon: 'ti-dashboard',
      path: '/admin/inverters'
    },
    {
      name: 'Config',
      icon: 'ti-settings',
      path: '/admin/configuration'
    },
    {
      name: 'Metrics',
      icon: 'ti-bar-chart',
      path: '/admin/metrics'
    },
    {
      name: 'Rental',
      icon: 'ti-home',
      path: '/admin/rental'
    },
    {
      name: 'Notifications',
      icon: 'ti-bell',
      path: '/admin/notifications'
    }
  ],
  displaySidebar (value) {
    this.showSidebar = value
  }
})

const SidebarPlugin = {

  install (app) {
    app.config.globalProperties.$sidebar = SidebarStore
    app.component('side-bar', Sidebar)
  }
}

export default SidebarPlugin
