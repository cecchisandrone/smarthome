<template>
  <div>

    <!--Stats cards-->
    <div class="row">
      <div class="col-lg-3 col-sm-6">
        <gate></gate>
      </div>
      <div class="col-lg-3 col-sm-6">
        <temperature></temperature>
      </div>
      <div class="col-lg-3 col-sm-6">
        <raspsonar></raspsonar>
      </div>
    </div>

    <!--Charts-->
    <div class="row">
      <div class="col-md-6">
        <temperature-chart></temperature-chart>
      </div>

      <div class="col-md-6">
        <raspsonar-chart></raspsonar-chart>
      </div>
    </div>

  </div>
</template>
<script>
  import Gate from 'components/Dashboard/Views/Overview/Gate.vue'
  import Temperature from 'components/Dashboard/Views/Overview/Temperature.vue'
  import TemperatureChart from 'components/Dashboard/Views/Overview/TemperatureChart.vue'
  import RaspsonarChart from 'components/Dashboard/Views/Overview/RaspsonarChart.vue'
  import Raspsonar from 'components/Dashboard/Views/Overview/Raspsonar.vue'
  import ChartCard from 'components/UIComponents/Cards/ChartCard.vue'
  export default {
    components: {
      Gate,
      Temperature,
      TemperatureChart,
      Raspsonar,
      RaspsonarChart,
      ChartCard
    }
  }
</script>
<style>

</style>
