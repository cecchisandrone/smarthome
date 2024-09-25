import Sidebar from './SideBar.vue'

const SidebarStore = {
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
}

const SidebarPlugin = {

  install (Vue) {
    Vue.mixin({
      data () {
        return {
          sidebarStore: SidebarStore
        }
      }
    })

    Object.defineProperty(Vue.prototype, '$sidebar', {
      get () {
        return this.$root.sidebarStore
      }
    })
    Vue.component('side-bar', Sidebar)
  }
}

export default SidebarPlugin
