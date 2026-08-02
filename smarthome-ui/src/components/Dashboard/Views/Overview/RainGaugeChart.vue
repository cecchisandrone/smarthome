<template>
  <chart-card ref="rainGaugeChart" :chart-data="rainGaugeChart.data" :chart-options="rainGaugeChart.options" :chart-type="rainGaugeChart.type">
    <template #title>
      <h4 class="title">Rainfall (mm)</h4>
    </template>
    <template #subTitle>
      <span> Measured every 2 hours</span>
    </template>
  </chart-card>  
</template>

<script>
  import ChartCard from 'components/UIComponents/Cards/ChartCard.vue'
  import * as rainGaugeService from 'src/services/rainGaugeService.js'
  export default {
    components: {
      ChartCard
    },
    data () {
      return {
        rainGaugeChart: {
          type: 'Bar',
          data: {
            labels: [],
            series: [[]]
          },
          options: {
            showArea: false,
            height: '300px',
            axisX: {
              showGrid: false
            },
            lineSmooth: this.$Chartist.Interpolation.simple({
              divisor: 3
            }),
            showLine: false,
            showPoint: true
          }
        }
      }
    },
    created () {
      var that = this
      rainGaugeService.getScheduledMeasurements().then((data) => {
        that.rainGaugeChart.data.labels = []
        that.rainGaugeChart.data.series = [[]]
        for (const prop in data) {
          that.rainGaugeChart.data.labels.push(new Date(prop).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'}))
          that.rainGaugeChart.data.series[0].push(data[prop])
        }
        that.$refs.rainGaugeChart.initChart()
      })
      .catch((err) => {
        that.errors = err.message
      })
    }
  }
</script>
