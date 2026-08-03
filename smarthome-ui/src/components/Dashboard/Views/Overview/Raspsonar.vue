<template>
    <stats-card>
        <template #header>
          <div class="text-center" :class="`icon-${raspsonar.type}`">
          <h3>Basement Water Level</h3>
          </div>
        </template>
        <template #content>
          <div class="numbers">
          {{raspsonar.value}}
          </div>
        </template>
        <template #footer>
          <div class="stats">
          <i :class="raspsonar.footerIcon"></i> {{raspsonar.footerText}}
          </div>
        </template>
    </stats-card>
</template>
<script>
  import StatsCard from 'components/UIComponents/Cards/StatsCard.vue'
  import * as raspsonarService from 'src/services/raspsonarService.js'
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
      const that = this
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
