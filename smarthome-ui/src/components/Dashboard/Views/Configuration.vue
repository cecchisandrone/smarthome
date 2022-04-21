<template>
  <div class="container-fluid">
    <div class="row">
      <camera-configuration :configuration="configuration" @loadConfiguration="loadConfiguration"></camera-configuration>
    </div>
    <div class="row">
      <well-pump-configuration :configuration="configuration" @loadConfiguration="loadConfiguration"></well-pump-configuration>
    </div>
    <div class="row">
      <inverter-configuration :configuration="configuration" @loadConfiguration="loadConfiguration"></inverter-configuration>
    </div>
    <div class="row">    
      <div class="col-sm-4">
        <raspsonar-configuration :raspsonar="configuration.Raspsonar" @raspsonarModified="raspsonarModified" @loadConfiguration="loadConfiguration"></raspsonar-configuration>
        <rain-gauge-configuration :rainGauge="configuration.RainGauge" @rainGaugeModified="rainGaugeModified" @loadConfiguration="loadConfiguration"></rain-gauge-configuration>
      </div>
      <div class="col-sm-4">
        <gate-configuration :gate="configuration.Gate" @gateModified="gateModified" @loadConfiguration="loadConfiguration"></gate-configuration>
        <temperature-configuration :temperature="configuration.Temperature" @temperatureModified="temperatureModified" @loadConfiguration="loadConfiguration"></temperature-configuration>
        <humidity-configuration :humidity="configuration.Humidity" @humidityModified="humidityModified" @loadConfiguration="loadConfiguration"></humidity-configuration>
        <heater-configuration :heater="configuration.Heater" @heaterModified="heaterModified" @loadConfiguration="loadConfiguration"></heater-configuration>
      </div>
      <div class="col-sm-4">
        <slack-configuration :slack="configuration.Slack" @slackModified="slackModified" @loadConfiguration="loadConfiguration"></slack-configuration>
        <alarm-configuration :alarm="configuration.Alarm" @alarmModified="alarmModified" @loadConfiguration="loadConfiguration"></alarm-configuration>
        <power-meter-configuration :powerMeter="configuration.PowerMeter" @powerMeterModified="powerMeterModified" @loadConfiguration="loadConfiguration"></power-meter-configuration>
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
  import * as AlarmConfiguration from 'src/components/Dashboard/Views/Configuration/Alarm.vue'
  import * as WellPumpConfiguration from 'src/components/Dashboard/Views/Configuration/WellPump.vue'
  import * as InverterConfiguration from 'src/components/Dashboard/Views/Configuration/Inverter.vue'
  import * as RainGaugeConfiguration from 'src/components/Dashboard/Views/Configuration/RainGauge.vue'
  import * as HumidityConfiguration from 'src/components/Dashboard/Views/Configuration/Humidity.vue'
  import * as HeaterConfiguration from 'src/components/Dashboard/Views/Configuration/Heater.vue'
  import * as PowerMeterConfiguration from 'src/components/Dashboard/Views/Configuration/PowerMeter.vue'

  export default {
    components: {
      'slack-configuration': SlackConfiguration,
      'camera-configuration': CameraConfiguration,
      'gate-configuration': GateConfiguration,
      'raspsonar-configuration': RaspsonarConfiguration,
      'temperature-configuration': TemperatureConfiguration,
      'alarm-configuration': AlarmConfiguration,
      'well-pump-configuration': WellPumpConfiguration,
      'rain-gauge-configuration': RainGaugeConfiguration,
      'humidity-configuration': HumidityConfiguration,
      'inverter-configuration': InverterConfiguration,
      'heater-configuration': HeaterConfiguration,
      'power-meter-configuration': PowerMeterConfiguration
    },
    data () {
      return {
        configuration: {Gate: {}, Raspsonar: {}, Slack: {}, Temperature: {}, Alarm: {}, RainGauge: {}, Humidity: {}, Inverter: {}, Heater: {}, PowerMeter: {}},
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
        console.log(this.configuration)
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
      },
      slackModified: function (slack) {
        this.saveButtonEnabled = true
        this.configuration.Slack = slack
      },
      temperatureModified: function (temperature) {
        this.saveButtonEnabled = true
        this.configuration.Temperature = temperature
      },
      alarmModified: function (alarm) {
        this.saveButtonEnabled = true
        this.configuration.Alarm = alarm
      },
      rainGaugeModified: function (rainGauge) {
        this.saveButtonEnabled = true
        this.configuration.RainGauge = rainGauge
      },
      humidityModified: function (humidity) {
        this.saveButtonEnabled = true
        this.configuration.Humidity = humidity
      },
      heaterModified: function (heater) {
        this.saveButtonEnabled = true
        this.configuration.Heater = heater
      },
      powerMeterModified: function (powerMeter) {
        this.saveButtonEnabled = true
        this.configuration.PowerMeter = powerMeter
      }
    },
    created () {
      this.loadConfiguration()
    }
  }

</script>
<style>
</style>
