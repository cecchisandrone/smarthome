<template>
  <div class='container'>

      <form class='form-signin'>
        <h2 class='form-signin-heading'>SmartHome Login</h2>
        <fg-input type='text' label='Username' placeholder='Username' v-model='username'></fg-input>
        <fg-input type='password' label='Password' placeholder='Password' v-model='password'></fg-input>        
        <div class='form-check'>
            <label class='form-check-label'>
                <input class='form-check-input' type='checkbox' value=''>
                Remember me
            </label>
        </div>
        <button v-on:click='loginUser()' type='submit' class='btn btn-info btn-fill btn-wd'>Sign in</button>
        <h5 v-show="errors !==''" class="text-danger">
          {{ errors }}
        </h5>
      </form>

    </div> <!-- /container -->
</template>

<script>
import * as loginService from './loginService.js'
export default {
  data () {
    return {
      username: '',
      password: '',
      errors: ''
    }
  },
  methods: {
    loginUser: function () {
      var app = this
      loginService
        .login(this.username, this.password)
        .then(function (res) {
          app.$store.commit('setLoggedIn', true)
          window.localStorage.setItem('smarthomeUser', JSON.stringify(res))
          app.$router.push('/')
        })
        .catch(function (err) {
          app.$store.commit('setLoggedIn', false)
          app.errors = err.message
        })
    }
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
