<template>
  <div class='wrapper'>
      <notifications>

      </notifications>
      <div class='form-signin' v-on:keyup.enter='loginUser'>
        <div class="text-center">
        <img class="avatar border-white" src="static/img/vue-logo.png" alt="...">
        <h3 class='form-signin-heading'>SmartHome Authentication</h3>
        </div>
        <fg-input type='text' label='Username' placeholder='Username' name='username' id='username' v-model='username'></fg-input>
        <fg-input type='password' label='Password' placeholder='Password' name='password' id='password' v-model='password'></fg-input>        
        <button v-on:click='loginUser()' type='submit' class='btn btn-info btn-fill btn-wd btn-block'>Sign in</button>                
        <h5 v-show="errors !==''" class="text-danger">
          {{ errors }}
        </h5>
      </div>

    </div> <!-- /container -->
</template>

<script>
import * as loginService from '@/services/authService.js'
import Notification from '@/components/UIComponents/NotificationPlugin/Notification.vue'
export default {
  props: {
    loggedOut: {
      type: String
    }
  },
  data () {
    return {
      username: '',
      password: '',
      errors: ''
    }
  },
  mounted () {
    if (this.loggedOut) {
      this.$notifications.notify(
        {
          message: 'You have been successfully logged out',
          icon: 'ti-user',
          horizontalAlign: 'center',
          verticalAlign: 'top',
          type: 'success'
        })
    }
  },
  methods: {
    loginUser: function () {
      this.errors = null
      var app = this
      loginService
        .login(this.username, this.password)
        .then(function (res) {
          app.$router.push('/')
        })
        .catch(function (err) {
          app.$store.commit('setLoggedIn', false)
          app.errors = err.message
        })
    }
  },
  components: {
    Notification
  }
}
</script>

<style>
.form-signin {
  max-width: 400px;
  padding: 15px;
  margin: 0 auto;
}
.form-signin .form-signin-heading,
.form-signin {
  margin-bottom: 10px;
}
.form-signin {
  font-weight: normal;
}
.form-signin .form-control {
  position: relative;
  height: auto;
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  box-sizing: border-box;
  padding: 10px;
  font-size: 16px;
}
.form-signin .form-control:focus {
  z-index: 2;
}
</style>
