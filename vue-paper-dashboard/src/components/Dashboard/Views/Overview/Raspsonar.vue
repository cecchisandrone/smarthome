<template>
    <stats-card>
        <div class="text-center" :class="`icon-${raspsonar.type}`" slot="header">
        <h3>Basement Water Level</h3>
        </div>
        <div class="numbers" slot="content">
        {{raspsonar.value}}
        </div>
        <div class="stats" slot="footer">
        <i :class="raspsonar.footerIcon"></i> {{raspsonar.footerText}}
        </div>
    </stats-card>
</template>
<script>
  import StatsCard from '@/components/Cards/StatsCard.vue'
  import * as raspsonarService from '@/services/raspsonarService.js'
  export default {
    components: {
      StatsCard
    },
    data () {
      return {
        raspsonar: {
          type: 'success',
          icon: 'ti-ruler',
          title: 'Basement water level',
          value: 'N.A. cm',
          footerText: '',
          footerIcon: 'ti-reload'
        }
      }
    },
    created () {
      var that = this
      raspsonarService.getLastMeasurement().then((data) => {
        that.raspsonar.value = data.value.toFixed(2) + ' cm'
        that.raspsonar.footerText = new Date(data.timestamp).toLocaleString()
      })
      .catch((err) => {
        that.raspsonar.footerText = err.message
      })
    }
  }
</script>
