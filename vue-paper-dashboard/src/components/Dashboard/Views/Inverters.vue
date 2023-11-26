<template>
  <div class="row">        
      <div class="col-md-12">
        <div v-if="globalErrors" class="alert alert-danger">{{globalErrors}}</div>
        <div v-if="inverters.length == 0" class="alert alert-info">No inverters configured</div>
        <div v-for="(inverter, index) in inverters">
          <h3>{{inverter.Name}}</h3>                                    
          <div v-if="errors[inverter.ID]" class="alert alert-danger">{{errors[inverter.ID]}}</div>
          <div v-for="(metric, name) in metrics[inverter.ID]">
             <span><b>{{metricsNames[name]}}:</b> <i>{{metric.toFixed(2)}}</i></span>
          </div>  
        </div>
      </div>
    </div> 
</template>

<script>
  import Simplert from 'vue2-simplert'
  import * as inverterService from '@/services/inverterService.js'

  export default {
    components: {
      Simplert
    },
    data () {
      return {
        title: 'Inverter metrics',
        metricsNames: {
          power_pin_1: 'Power Pin 1 (W)',
          power_pin_2: 'Power Pin 2 (W)',
          grid_power_reading: 'Total (W)',
          power_peak: 'Power peak (W)',
          power_peak_today: 'Power peak today (W)',
          daily_energy: 'Daily energy (KWh)',
          weekly_energy: 'Weekly energy (KWh)',
          monthly_energy: 'Monthly energy (KWh)',
          yearly_energy: 'Yearly energy (KWh)',
          riso: 'Riso (MΩ)',
          inverter_temperature: 'Inverter Temperature (°C)',
          booster_temperature: 'Booster Temperature (°C)',
          dc_ac_conversion_efficiency: 'DC/AC Conversion Efficiency (%)'
        },
        inverters: {},
        errors: {},
        globalErrors: null,
        metrics: {}
      }
    },
    created () {
      var app = this
      inverterService.getAllInverters().then((inverters) => {
        app.inverters = inverters
        inverters.forEach(inverter => {
          inverterService.getInverterMetrics(inverter.ID).then((data) => {
            app.$set(app.metrics, inverter.ID, data.metrics)
          })
          .catch((err) => {
            app.$set(app.errors, inverter.ID, err.message)
          })
        })
      })
      .catch((err) => {
        app.globalErrors = err.message
      })
    }
  }

</script>
