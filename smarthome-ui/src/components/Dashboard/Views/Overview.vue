<template>
  <div>

    <!--Stats cards-->
    <div class="row">
      <div class="col-lg-2 col-sm-6">
        <gate></gate>
      </div>
      <div class="col-lg-2 col-sm-6">
        <well-pump></well-pump>
      </div>      
      <div class="col-lg-2 col-sm-6">
        <temperature></temperature>
      </div>
      <div class="col-lg-2 col-sm-6">
        <alarm></alarm>
      </div>
      <div class="col-lg-2 col-sm-6">
        <pump></pump>
      </div>
      <div class="col-lg-2 col-sm-6">
        <raspsonar></raspsonar>
      </div>
      <div class="col-lg-2 col-sm-6">
        <rain-gauge></rain-gauge>
      </div>
      <div class="col-lg-2 col-sm-6">
        <humidity></humidity>
      </div>
    </div>

    <!--Charts-->
    <div class="row">
      <div class="col-md-6">
        <temperature-chart></temperature-chart>
      </div>
      <div class="col-md-6">
        <humidity-chart></humidity-chart>
      </div>
      <div class="col-md-6">
        <rain-gauge-chart></rain-gauge-chart>
      </div>
      <div class="col-md-6">
        <raspsonar-chart></raspsonar-chart>
      </div>
    </div>

  </div>
</template>
<script>
  import Gate from 'components/Dashboard/Views/Overview/Gate.vue'
  import Pump from 'components/Dashboard/Views/Overview/Pump.vue'
  import Temperature from 'components/Dashboard/Views/Overview/Temperature.vue'
  import TemperatureChart from 'components/Dashboard/Views/Overview/TemperatureChart.vue'
  import RaspsonarChart from 'components/Dashboard/Views/Overview/RaspsonarChart.vue'
  import Raspsonar from 'components/Dashboard/Views/Overview/Raspsonar.vue'
  import Alarm from 'components/Dashboard/Views/Overview/Alarm.vue'
  import WellPump from 'components/Dashboard/Views/Overview/WellPump.vue'
  import ChartCard from 'components/UIComponents/Cards/ChartCard.vue'
  import RainGauge from 'components/Dashboard/Views/Overview/RainGauge.vue'
  import RainGaugeChart from 'components/Dashboard/Views/Overview/RainGaugeChart.vue'
  import Humidity from 'components/Dashboard/Views/Overview/Humidity.vue'
  import HumidityChart from 'components/Dashboard/Views/Overview/HumidityChart.vue'
  
  export default {
    components: {
      Gate,
      Pump,
      Temperature,
      TemperatureChart,
      Raspsonar,
      RaspsonarChart,
      ChartCard,
      Alarm,
      WellPump,
      RainGauge,
      RainGaugeChart,
      Humidity,
      HumidityChart
    }
  }
</script>
<style>

</style>
