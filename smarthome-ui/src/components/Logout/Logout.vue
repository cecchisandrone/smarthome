<template>
  <!-- .prevent, or the anchor's own navigation to '#' runs after the router
       push and strips the '?loggedOut=true' query back off the URL. -->
  <a v-on:click.prevent="logoutUser()" href="#" class="dropdown-toggle btn-magnify" data-toggle="dropdown">
    <i class="ti-user"></i>
    <p>Logout</p>
  </a>
</template>

<script>
export default {
  methods: {
    logoutUser: function () {
      this.$sidebar.displaySidebar(false)
      localStorage.removeItem('smarthomeUser')
      this.$router.push({ name: 'login', query: { loggedOut: 'true' } })
    }
  }
}
</script>
