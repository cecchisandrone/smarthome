import { reactive } from 'vue'
import Notifications from './Notifications.vue'

/**
 * On Vue 2 this was a plain object made reactive by accident: Notifications.vue
 * returns `state` from data(), which put it through the observer. Vue 3 has no
 * such implicit step, so the store declares its own reactivity.
 */
const NotificationStore = reactive({
  state: [], // here the notifications will be added

  removeNotification (index) {
    this.state.splice(index, 1)
  },
  notify (notification) {
    this.state.push(notification)
  }
})

var NotificationsPlugin = {

  install (app) {
    app.config.globalProperties.$notifications = NotificationStore
    app.component('Notifications', Notifications)
  }
}

export default NotificationsPlugin
