<template>
  <chart-card ref="temperatureChart" :chart-data="temperatureChart.data" :chart-options="temperatureChart.options">
    <template #title>
      <h4 class="title">Outdoor Temperature (°C)</h4>
    </template>
    <template #subTitle>
      <span> Measured every 2 hours</span>
    </template>
  </chart-card>  
</template>

<script>
  import ChartCard from 'components/UIComponents/Cards/ChartCard.vue'
  import * as temperatureService from 'src/services/temperatureService.js'
  export default {
    components: {
      ChartCard
    },
    data () {
      return {
        temperatureChart: {
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
      temperatureService.getScheduledMeasurements().then((data) => {
        that.temperatureChart.data.labels = []
        that.temperatureChart.data.series = [[]]
        for (const prop in data) {
          that.temperatureChart.data.labels.push(new Date(prop).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'}))
          that.temperatureChart.data.series[0].push(data[prop])
        }
        that.$refs.temperatureChart.initChart()
      })
      .catch((err) => {
        that.errors = err.message
      })
    }
  }
</script>
