import { reactive } from 'vue'
import Notifications from './Notifications.vue'

/**
 * On Vue 2 this was a plain object made reactive by accident: Notifications.vue
 * returns `state` from data(), which put it through the observer. Vue 3 has no
 * such implicit step, so the store declares its own reactivity.
 */
let nextId = 0

const NotificationStore = reactive({
  state: [], // here the notifications will be added

  removeNotification (index) {
    this.state.splice(index, 1)
  },
  notify (notification) {
    // The id exists purely so the v-for in Notifications.vue has a stable
    // primitive :key. It used to key on the notification object itself, which
    // defeats list-diffing whenever a notification is removed from the middle.
    this.state.push(Object.assign({ id: nextId++ }, notification))
  }
})

const NotificationsPlugin = {

  install (app) {
    app.config.globalProperties.$notifications = NotificationStore
    app.component('Notifications', Notifications)
  }
}

export default NotificationsPlugin
