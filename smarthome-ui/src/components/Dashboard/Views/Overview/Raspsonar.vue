<template>
    <stats-card>
        <div class="icon-big text-center" :class="`icon-${raspsonar.type}`" slot="header">
        <i :class="raspsonar.icon"></i>
        </div>
        <div class="numbers" slot="content">
        <p>{{raspsonar.title}}</p>
        {{raspsonar.value}}
        </div>
        <div class="stats" slot="footer">
        <i :class="raspsonar.footerIcon"></i> {{raspsonar.footerText}}
        </div>
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
          footerText: 'Updated now',
          footerIcon: 'ti-reload'
        }
      }
    },
    created () {
      var that = this
      raspsonarService.getLastMeasurement().then((data) => {
        that.raspsonar.value = data.value.toFixed(2) + ' cm'
        that.raspsonar.footerText = 'Updated at ' + new Date(data.timestamp).toLocaleString()
      })
      .catch((err) => {
        that.errors = err.message
      })
    }
  }
</script>
