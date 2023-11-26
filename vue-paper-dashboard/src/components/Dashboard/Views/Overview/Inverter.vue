<template>
  <stats-card>
    <div class="icon-success" slot="header">
      <h3>Inverters</h3>
    </div>
    <div class="numbers" slot="content">
      <div v-for="inverter in inverters">
        <h6>{{ inverter.Name}}</h6>
        <span>{{getInverterMetric(inverter.Name, 'grid_power_reading')}} W</span>
      </div>      
    </div>
    <div class="stats" slot="footer">
      <i v-if="messages" class="ti-info"></i> {{messages}}
      <i class="ti-reload"></i> {{footerText}}
    </div>
  </stats-card>
</template>
<script>
  import StatsCard from '@/components/Cards/StatsCard.vue'
  import * as inverterService from '@/services/inverterService.js'
  import * as configurationService from '@/services/configurationService.js'
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
              that.$set(that.invertersMetrics, name, data2.metrics)
              that.footerText = new Date().toLocaleString()
            })
            .catch((err) => {
              that.$set(that.invertersMetrics, name, null)
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
