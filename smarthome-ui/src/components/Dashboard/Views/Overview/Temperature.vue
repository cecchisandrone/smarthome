<template>
    <stats-card>
        <div class="icon-big text-center" :class="`icon-${temperature.type}`" slot="header">
        <i :class="temperature.icon"></i>
        </div>
        <div class="numbers" slot="content">
        <p>{{temperature.title}}</p>
        {{temperature.value}}
        </div>
        <div class="stats" slot="footer">
        <i :class="temperature.footerIcon"></i> {{temperature.footerText}}
        </div>
    </stats-card>
</template>
<script>
  import StatsCard from 'components/UIComponents/Cards/StatsCard.vue'
  import * as temperatureService from 'src/services/temperatureService.js'
  export default {
    components: {
      StatsCard
    },
    data () {
      return {
        temperature: {
          type: 'success',
          icon: 'ti-cloud',
          title: 'Outdoor temperature',
          value: 'N.A °C',
          footerText: '',
          footerIcon: 'ti-reload'
        }
      }
    },
    created () {
      var that = this
      temperatureService.getLastMeasurement().then((data) => {
        that.temperature.value = data.value.toFixed(2) + ' °C'
        that.temperature.footerText = 'Updated at ' + new Date(data.timestamp).toLocaleString()
      })
      .catch((err) => {
        that.temperature.footerText = err.message
      })
    }
  }
</script>
