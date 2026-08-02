<template>
  <stats-card>
    <template #header>
      <div class="icon-success">
        <h3>Inverters</h3>
      </div>
    </template>
    <template #content>
      <div class="numbers">
        <div v-for="inverter in inverters">
          <h6>{{ inverter.Name}}</h6>
          <span>{{getInverterMetric(inverter.Name, 'grid_power_reading')}} W</span>
        </div>      
      </div>
    </template>
    <template #footer>
      <div class="stats">
        <i v-if="messages" class="ti-info"></i> {{messages}}
        <i class="ti-reload"></i> {{footerText}}
      </div>
    </template>
  </stats-card>
</template>
<script>
  import StatsCard from 'components/UIComponents/Cards/StatsCard.vue'
  import * as inverterService from 'src/services/inverterService.js'
  import * as configurationService from 'src/services/configurationService.js'
  export default {
    components: {
      StatsCard
    },
    data () {
      return {
        messages: '',
        inverters: null,
        invertersMetrics: {},
        footerText: ''
      }
    },
    methods: {
      init: function () {
        var that = this
        configurationService.getConfiguration().then((data) => {
          that.inverters = data.Inverters
          for (var i = 0; i < data.Inverters.length; i++) {
            let name = data.Inverters[i].Name
            let id = data.Inverters[i].ID
            inverterService.getInverterMetrics(id).then((data2) => {
              that.invertersMetrics[name] = data2.metrics
              that.footerText = new Date().toLocaleString()
            })
            .catch((err) => {
              that.invertersMetrics[name] = null
              that.messages += name + ': ' + err.message
            })
          }
        })
        .catch((err) => {
          that.messages = err.message
        })
      },
      getInverterMetric: function (inverterName, metric) {
        if (this.invertersMetrics[inverterName]) {
          return this.invertersMetrics[inverterName][metric].toFixed(0)
        }
        return 'N.A.'
      }
    },
    created () {
      this.init()
    }
  }
</script>
