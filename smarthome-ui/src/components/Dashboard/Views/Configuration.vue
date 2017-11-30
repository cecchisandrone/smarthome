<template>
  <div id="app-4">
    <camera-configuration :configuration="configuration" v-on:loadConfiguration="loadConfiguration"></camera-configuration>
    <slack-configuration :configuration="configuration" v-on:loadConfiguration="loadConfiguration"></slack-configuration>
  </div>
</template>
<script>
  import * as configurationService from 'src/services/configurationService.js'
  import * as SlackConfiguration from 'src/components/Dashboard/Views/Configuration/Slack.vue'
  import * as CameraConfiguration from 'src/components/Dashboard/Views/Configuration/Camera.vue'

  export default {
    components: {
      'slack-configuration': SlackConfiguration,
      'camera-configuration': CameraConfiguration
    },
    data () {
      return {
        configuration: {},
        errors: null
      }
    },
    methods: {
      loadConfiguration: function () {
        var app = this
        configurationService.getConfiguration().then((data) => {
          app.configuration = data
        })
        .catch((err) => {
          app.errors = err.message
        })
      }
    },
    created () {
      this.loadConfiguration()
    }
  }

</script>
<style>
</style>
