<template>
  <chart-card ref="powerMeterChart" :chart-data="powerMeterChart.data" :chart-options="powerMeterChart.options">
    <h4 class="title" slot="title">Power (W)</h4>
    <span slot="subTitle"> Measured every 5 minutes</span>
  </chart-card>  
</template>

<script>
  import ChartCard from 'components/UIComponents/Cards/ChartCard.vue'
  import * as powerMeterService from 'src/services/powerMeterService.js'
  export default {
    components: {
      ChartCard
    },
    data () {
      return {
        powerMeterChart: {
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
      powerMeterService.getScheduledMeasurements().then((data) => {
        that.powerMeterChart.data.labels = []
        that.powerMeterChart.data.series = [[]]
        that.powerMeterChart.data.series[1] = []
        for (const prop in data) {
          that.powerMeterChart.data.labels.push(new Date(prop).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'}))
          let value = data[prop]
          that.powerMeterChart.data.series[0].push(-value)
        }
        that.$refs.powerMeterChart.initChart()
      })
      .catch((err) => {
        that.errors = err.message
      })
    }
  }
</script>
