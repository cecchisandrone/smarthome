<template>
  <a v-on:click="logoutUser()" href="#" class="dropdown-toggle btn-magnify" data-toggle="dropdown">
    <i class="ti-user"></i>
    <p>Logout</p>
  </a>
</template>

<script>
export default {
  methods: {
    logoutUser: function () {
      localStorage.removeItem('smarthomeUser')
      this.$store.commit('setLoggedIn', false)
      this.$router.push('/login')
    }
  }
}
</script>
