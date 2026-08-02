<template>
    <stats-card>
        <template #header>
          <div class="text-center" :class="`icon-${temperature.type}`">
          <h3>Outdoor Temperature</h3>
          </div>
        </template>
        <template #content>
          <div class="numbers">
          {{temperature.value}}
          </div>
        </template>
        <template #footer>
          <div class="stats">
          <i :class="temperature.footerIcon"></i> {{temperature.footerText}}
          </div>
        </template>
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
        that.temperature.footerText = new Date(data.timestamp).toLocaleString()
      })
      .catch((err) => {
        that.temperature.footerText = err.message
      })
    }
  }
</script>
