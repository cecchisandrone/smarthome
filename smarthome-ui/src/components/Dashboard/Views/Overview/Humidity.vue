<template>
    <stats-card>
        <template #header>
          <div class="text-center" :class="`icon-${humidity.type}`">
          <h3>Outdoor Humidity</h3>
          </div>
        </template>
        <template #content>
          <div class="numbers">
          {{humidity.value}}
          </div>
        </template>
        <template #footer>
          <div class="stats">
          <i :class="humidity.footerIcon"></i> {{humidity.footerText}}
          </div>
        </template>
    </stats-card>
</template>
<script>
  import StatsCard from 'components/UIComponents/Cards/StatsCard.vue'
  import * as humidityService from 'src/services/humidityService.js'
  export default {
    components: {
      StatsCard
    },
    data () {
      return {
        humidity: {
          type: 'success',
          icon: 'ti-cloud',
          title: 'Outdoor humidity',
          value: 'N.A %',
          footerText: '',
          footerIcon: 'ti-reload'
        }
      }
    },
    created () {
      const that = this
      humidityService.getLastMeasurement().then((data) => {
        that.humidity.value = data.value.toFixed(2) + ' %'
        that.humidity.footerText = new Date(data.timestamp).toLocaleString()
      })
      .catch((err) => {
        that.humidity.footerText = err.message
      })
    }
  }
</script>
