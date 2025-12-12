<template>
    <stats-card>
        <div class="text-center" :class="`icon-${power.type}`" slot="header">
        <h3>{{power.title}}</h3>
        </div>
        <div class="numbers" slot="content">
        <u :style="power.decoration">{{power.value}}</u>
        </div>
        <div class="stats" slot="footer">
        <i :class="power.footerIcon"></i> {{power.footerText}}
        </div>
    </stats-card>
</template>
<script>
  import StatsCard from 'components/UIComponents/Cards/StatsCard.vue'
  import * as powerMeterService from 'src/services/powerMeterService.js'
  export default {
    components: {
      StatsCard
    },
    data () {
      return {
        power: {
          type: 'success',
          icon: 'ti-plug',
          title: 'Power',
          value: 'N.A W',
          decoration: 'text-decoration-color: red',
          footerText: '',
          footerIcon: 'ti-reload'
        }
      }
    },
    created () {
      var that = this
      powerMeterService.getLastMeasurement().then((data) => {
        that.power.decoration = 'text-decoration-color: ' + (data.value.toFixed(2) < 0 ? 'green' : 'red')
        that.power.value = Math.abs(data.value.toFixed(2)) + ' W'
        that.power.footerText = new Date(data.timestamp).toLocaleString()
      })
      .catch((err) => {
        that.power.footerText = err.message
      })
    }
  }
</script>
