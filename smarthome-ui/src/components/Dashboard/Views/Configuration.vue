<template>
  <div class="container-fluid">
    <div class="row">
      <camera-configuration :configuration="configuration" @loadConfiguration="loadConfiguration"></camera-configuration>
    </div>
    <div class="row">    
      <div class="col-sm-3">
        <slack-configuration :configuration="configuration" @loadConfiguration="loadConfiguration"></slack-configuration>
      </div>
      <div class="col-sm-3">
        <raspsonar-configuration :raspsonar="configuration.Raspsonar" @raspsonarModified="raspsonarModified" @loadConfiguration="loadConfiguration"></raspsonar-configuration>
      </div>
      <div class="col-sm-3">
        <gate-configuration :gate="configuration.Gate" @gateModified="gateModified" @loadConfiguration="loadConfiguration"></gate-configuration>
      </div>
      <div class="col-sm-3">
        <temperature-configuration :configuration="configuration" @loadConfiguration="loadConfiguration"></temperature-configuration>
      </div>
    </div>
    <button v-if="saveButtonEnabled" style="margin: 10px" class="btn btn-success" v-on:click="saveConfiguration">
      Save
    </button>
  </div>
  
</template>
<script>
  import * as configurationService from 'src/services/configurationService.js'
  import * as SlackConfiguration from 'src/components/Dashboard/Views/Configuration/Slack.vue'
  import * as CameraConfiguration from 'src/components/Dashboard/Views/Configuration/Camera.vue'
  import * as GateConfiguration from 'src/components/Dashboard/Views/Configuration/Gate.vue'
  import * as RaspsonarConfiguration from 'src/components/Dashboard/Views/Configuration/Raspsonar.vue'
  import * as TemperatureConfiguration from 'src/components/Dashboard/Views/Configuration/Temperature.vue'

  export default {
    components: {
      'slack-configuration': SlackConfiguration,
      'camera-configuration': CameraConfiguration,
      'gate-configuration': GateConfiguration,
      'raspsonar-configuration': RaspsonarConfiguration,
      'temperature-configuration': TemperatureConfiguration
    },
    data () {
      return {
        configuration: {Gate: {}, Raspsonar: {}},
        errors: null,
        saveButtonEnabled: false
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
      },
      saveConfiguration: function () {
        var app = this
        configurationService.saveConfiguration(this.configuration).then((data) => {
          app.configuration = data
          this.$notifications.notify({message: 'Configuration saved', horizontalAlign: 'center', verticalAlign: 'top', type: 'success'})
        })
        .catch((err) => {
          app.errors = err.message
          this.$notifications.notify({message: err.message, horizontalAlign: 'center', verticalAlign: 'top', type: 'danger'})
        })
      },
      gateModified: function (gate) {
        this.saveButtonEnabled = true
        this.configuration.Gate = gate
      },
      raspsonarModified: function (raspsonar) {
        this.saveButtonEnabled = true
        this.configuration.Raspsonar = raspsonar
      }
    },
    created () {
      this.loadConfiguration()
    }
  }

</script>
<style>
</style>
