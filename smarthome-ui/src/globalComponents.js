import fgInput from './components/UIComponents/Inputs/formGroupInput.vue'
import DropDown from './components/UIComponents/Dropdown.vue'
import Logout from './components/Logout/Logout.vue'
import Modal from './components/UIComponents/Modal/Modal.vue'

/**
 * You can register global components here and use them as a plugin in your main Vue instance
 */

const GlobalComponents = {
  install (app) {
    app.component('fg-input', fgInput)
    app.component('drop-down', DropDown)
    app.component('logout', Logout)
    app.component('modal', Modal)
  }
}

export default GlobalComponents
