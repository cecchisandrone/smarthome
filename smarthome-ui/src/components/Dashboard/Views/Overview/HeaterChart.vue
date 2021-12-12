<template>
  <chart-card ref="heaterChart" :chart-data="heaterChart.data" :chart-options="heaterChart.options">
    <h4 class="title" slot="title">Heater Temperature (°C)</h4>
    <span slot="subTitle"> Measured every 30 minutes</span>
  </chart-card>  
</template>

<script>
  import ChartCard from 'components/UIComponents/Cards/ChartCard.vue'
  import * as heaterService from 'src/services/heaterService.js'
  export default {
    components: {
      ChartCard
    },
    data () {
      return {
        heaterChart: {
          data: {
            labels: [],
            series: [[]]
          },
          options: {
            showArea: false,
            height: '250px',
            axisX: {
              showGrid: false
            },
            lineSmooth: this.$Chartist.Interpolation.simple({
              divisor: 3
            }),
            showLine: true,
            showPoint: false
          }
        }
      }
    },
    created () {
      var that = this
      heaterService.getScheduledMeasurements().then((data) => {
        that.heaterChart.data.labels = []
        that.heaterChart.data.series = [[]]
        for (const prop in data) {
          that.heaterChart.data.labels.push(new Date(prop).toLocaleTimeString([], {day: '2-digit', hour: '2-digit', minute: '2-digit'}))
          that.heaterChart.data.series[0].push(data[prop])
        }
        that.$refs.heaterChart.initChart()
      })
      .catch((err) => {
        that.errors = err.message
      })
    }
  }
</script>
