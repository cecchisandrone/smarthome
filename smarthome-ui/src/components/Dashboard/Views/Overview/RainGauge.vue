<template>
    <stats-card>
        <template #header>
          <div class="text-center" :class="`icon-${rainGauge.type}`">
          <h3>Rainfall</h3>
          <h5>Last 24h</h5>
          </div>
        </template>
        <template #content>
          <div class="numbers">
          {{rainGauge.value}}
          </div>
        </template>
        <template #footer>
          <div class="stats">
          <i :class="rainGauge.footerIcon"></i> {{rainGauge.footerText}}
          </div>
        </template>
    </stats-card>
</template>
<script>
  import StatsCard from 'components/UIComponents/Cards/StatsCard.vue'
  import * as rainGaugeService from 'src/services/rainGaugeService.js'
  export default {
    components: {
      StatsCard
    },
    data () {
      return {
        rainGauge: {
          type: 'success',
          icon: 'ti-cloud',
          title: 'Rain quantity',
          value: 'N.A mm',
          footerText: '',
          footerIcon: 'ti-reload'
        }
      }
    },
    created () {
      const that = this
      rainGaugeService.getLast24hTotal().then((data) => {
        that.rainGauge.value = data.value.toFixed(2) + ' mm'
        that.rainGauge.footerText = new Date(data.timestamp).toLocaleString()
      })
      .catch((err) => {
        that.rainGauge.footerText = err.message
      })
    }
  }
</script>
