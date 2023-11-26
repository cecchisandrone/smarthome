import DashboardLayout from '../components/Dashboard/Layout/DashboardLayout.vue'
// GeneralViews
import NotFound from '../components/GeneralViews/NotFoundPage.vue'

// Admin pages
import Overview from '../components/Dashboard/Views/Overview.vue'
import UserProfile from '../components/Dashboard/Views/UserProfile.vue'
import Notifications from '../components/Dashboard/Views/Notifications.vue'
import Login from '../components/Login/Login.vue'
import Configuration from '../components/Dashboard/Views/Configuration.vue'
import Cameras from '../components/Dashboard/Views/Cameras.vue'
import WebRadio from '../components/Dashboard/Views/WebRadio.vue'
import Inverters from '../components/Dashboard/Views/Inverters.vue'
import Metrics from '../components/Dashboard/Views/Metrics.vue'

const routes = [
  {
    name: 'login',
    path: '/login',
    component: Login,
    props: (route) => ({ loggedOut: route.query.loggedOut })
  },
  {
    path: '/',
    component: DashboardLayout,
    redirect: '/admin/overview'
  },
  {
    path: '/admin',
    component: DashboardLayout,
    redirect: '/admin/stats',
    children: [
      {
        path: 'overview',
        name: 'overview',
        component: Overview
      },
      {
        path: 'configuration',
        name: 'configuration',
        component: Configuration
      },
      {
        path: 'cameras',
        name: 'cameras',
        component: Cameras
      },
      {
        path: 'inverters',
        name: 'inverters',
        component: Inverters
      },
      {
        path: 'stats',
        name: 'stats',
        component: UserProfile
      },
      {
        path: 'notifications',
        name: 'notifications',
        component: Notifications
      },
      {
        path: 'webradio',
        name: 'webradio',
        component: WebRadio
      },
      {
        path: 'metrics',
        name: 'metrics',
        component: Metrics
      }
    ]
  },
  {
    path: '*',
    component: NotFound
  }
]

/**
 * Asynchronously load view (Webpack Lazy loading compatible)
 * The specified component must be inside the Views folder
 * @param  {string} name  the filename (basename) of the view to load.
function view(name) {
   var res= require('../components/Dashboard/Views/' + name + '.vue');
   return res;
};**/

export default routes
