<template>
    <stats-card>
        <div class="text-center" :class="`icon-${rainGauge.type}`" slot="header">
        <h3>Rainfall</h3>
        <h5>Last 24h</h5>
        </div>
        <div class="numbers" slot="content">
        {{rainGauge.value}}
        </div>
        <div class="stats" slot="footer">
        <i :class="rainGauge.footerIcon"></i> {{rainGauge.footerText}}
        </div>
    </stats-card>
</template>
<script>
  import StatsCard from '@/components/Cards/StatsCard.vue'
  import * as rainGaugeService from '@/services/rainGaugeService.js'
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
      var that = this
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
