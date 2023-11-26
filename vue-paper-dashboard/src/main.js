/*!

 =========================================================
 * Vue Paper Dashboard - v1.0.1
 =========================================================

 * Product Page: http://www.creative-tim.com/product/paper-dashboard
 * Copyright 2023 Creative Tim (http://www.creative-tim.com)
 * Licensed under MIT (https://github.com/creativetimofficial/paper-dashboard/blob/master/LICENSE.md)

 =========================================================

 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

 */
import Vue from "vue";
import App from "./App";
import router from "./router/index";

import PaperDashboard from "./plugins/paperDashboard";
import GlobalComponents from './globalComponents'
import "vue-notifyjs/themes/default.css";

Vue.use(PaperDashboard);
Vue.use(GlobalComponents);

/* eslint-disable no-new */
new Vue({
  router,
  render: (h) => h(App),
}).$mount("#app");

require('dotenv').config()
console.log(process.env)