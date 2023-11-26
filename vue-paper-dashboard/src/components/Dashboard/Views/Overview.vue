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
        <inverter></inverter>
      </div>
      <div class="col-lg-2 col-sm-6">
        <humidity></humidity>
      </div>
      <div class="col-lg-2 col-sm-6">
        <power-meter></power-meter>
      </div>
      <div class="col-lg-2 col-sm-6">
        <heater></heater>
      </div>
      <div class="col-lg-2 col-sm-6">
        <relay></relay>
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
      <div class="col-md-6">
        <heater-chart></heater-chart>
      </div>
      <div class="col-md-6">
        <power-meter-chart></power-meter-chart>
      </div>
    </div>

  </div>
</template>
<script>
  import Gate from './Overview/Gate.vue'
  import Pump from './Overview/Pump.vue'
  import Temperature from './Overview/Temperature.vue'
  import TemperatureChart from './Overview/TemperatureChart.vue'
  import RaspsonarChart from './Overview/RaspsonarChart.vue'
  import Raspsonar from './Overview/Raspsonar.vue'
  import Alarm from './Overview/Alarm.vue'
  import WellPump from './Overview/WellPump.vue'
  import Inverter from './Overview/Inverter.vue'
  import ChartCard from '@/components/UIComponents/Cards/ChartCard.vue'
  import RainGauge from './Overview/RainGauge.vue'
  import RainGaugeChart from './Overview/RainGaugeChart.vue'
  import Humidity from './Overview/Humidity.vue'
  import HumidityChart from './Overview/HumidityChart.vue'
  import Heater from './Overview/Heater.vue'
  import HeaterChart from './Overview/HeaterChart.vue'
  import PowerMeter from './Overview/PowerMeter.vue'
  import PowerMeterChart from './Overview/PowerMeterChart.vue'
  import Relay from './Overview/Relay.vue'

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
      Inverter,
      RainGauge,
      RainGaugeChart,
      Humidity,
      HumidityChart,
      Heater,
      HeaterChart,
      PowerMeter,
      PowerMeterChart,
      Relay
    }
  }
</script>
<style>

</style>
