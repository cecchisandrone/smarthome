<template>
  <chart-card ref="humidityChart" :chart-data="humidityChart.data" :chart-options="humidityChart.options">
    <h4 class="title" slot="title">Outdoor Humidity (%)</h4>
    <span slot="subTitle"> Measured every 2 hours</span>
  </chart-card>  
</template>

<script>
  import ChartCard from 'components/UIComponents/Cards/ChartCard.vue'
  import * as humidityService from 'src/services/humidityService.js'
  export default {
    components: {
      ChartCard
    },
    data () {
      return {
        humidityChart: {
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
      humidityService.getScheduledMeasurements().then((data) => {
        that.humidityChart.data.labels = []
        that.humidityChart.data.series = [[]]
        for (const prop in data) {
          that.humidityChart.data.labels.push(new Date(prop).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'}))
          that.humidityChart.data.series[0].push(data[prop])
        }
        that.$refs.humidityChart.initChart()
      })
      .catch((err) => {
        that.errors = err.message
      })
    }
  }
</script>
