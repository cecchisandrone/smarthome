<template>
    <stats-card>
        <div class="text-center" :class="`icon-${humidity.type}`" slot="header">
        <h3>Outdoor Humidity</h3>
        </div>
        <div class="numbers" slot="content">
        {{humidity.value}}
        </div>
        <div class="stats" slot="footer">
        <i :class="humidity.footerIcon"></i> {{humidity.footerText}}
        </div>
    </stats-card>
</template>
<script>
  import StatsCard from '@/components/Cards/StatsCard.vue'
  import * as humidityService from '@/services/humidityService.js'
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
      var that = this
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
