import Sidebar from "./SideBar.vue";
import SidebarLink from "./SidebarLink";

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
  install(Vue) {
    let app = new Vue({
      data: {
        sidebarStore: SidebarStore,
      },
    });

    Vue.prototype.$sidebar = app.sidebarStore;
    Vue.component("side-bar", Sidebar);
    Vue.component("sidebar-link", SidebarLink);
  },
};

export default SidebarPlugin;
