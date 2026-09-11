<template>
  <footer class="footer">
    <div class="container-fluid">
      <nav class="pull-left">
        <ul>
          <li>
            <router-link :to="{path:'/admin'}">Dashboard</router-link>
          </li>
        </ul>
      </nav>
      <div class="copyright pull-right">
        &copy; Coded with
        <i class="fa fa-heart heart"></i> by
        <a href="https://github.com/cecchisandrone" target="_blank">Alessandro Dionisi</a>.
        Design by <a href="https://www.creative-tim.com/?ref=pdf-vuejs" target="_blank">Creative Tim</a>.
        <span v-if="gitVersion" class="git-version">Git Version: {{ gitVersion }}</span>
      </div>
    </div>
  </footer>
</template>
<script>
  export default {
    computed: {
      gitVersion () {
        return import.meta.env.GIT_VERSION
      }
    }
  }
</script>
<style>

</style>
