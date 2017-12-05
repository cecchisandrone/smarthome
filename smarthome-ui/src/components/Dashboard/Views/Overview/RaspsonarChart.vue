<template>
  <chart-card ref="raspsonarChart" :chart-data="raspsonarChart.data" :chart-options="raspsonarChart.options">
    <h4 class="title" slot="title">Basement water level</h4>
    <span slot="subTitle"> Measured every hour</span>
  </chart-card>  
</template>

<script>
  import ChartCard from 'components/UIComponents/Cards/ChartCard.vue'
  import * as raspsonarService from 'src/services/raspsonarService.js'
  export default {
    components: {
      ChartCard
    },
    data () {
      return {
        raspsonarChart: {
          data: {
            labels: [],
            series: [[]]
          },
          options: {
            low: 48,
            high: 62,
            showArea: false,
            height: '250px',
            axisX: {
              showGrid: false
            },
            lineSmooth: this.$Chartist.Interpolation.simple({
              divisor: 3
            }),
            showLine: true,
            showPoint: true
          }
        }
      }
    },
    created () {
      var that = this
      raspsonarService.getScheduledMeasurements().then((data) => {
        that.raspsonarChart.data.labels = []
        that.raspsonarChart.data.series = [[]]
        for (const prop in data) {
          that.raspsonarChart.data.labels.push(new Date(prop).toLocaleTimeString())
          that.raspsonarChart.data.series[0].push(data[prop])
        }
        that.$refs.raspsonarChart.initChart()
      })
      .catch((err) => {
        that.errors = err.message
      })
    }
  }
</script>
