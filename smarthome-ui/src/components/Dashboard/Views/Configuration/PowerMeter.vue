<template>
    <div>
        <h3>Power Meter</h3>
        <div class="card">
          <div class="container">
          <div class="row">
          <form class="col-md-4">
            <fg-input type="text"
                    label="Host"
                    placeholder="Host"
                    v-model="powerMeter.Host"
                    @input="modelChanged">
            </fg-input>
            <fg-input type="number"
                    label="Port"
                    placeholder="Port"
                    v-model.number="powerMeter.Port"
                    @input="modelChanged">
            </fg-input>
            <fg-input type="number"
                    label="Voltage"
                    placeholder="Voltage"
                    v-model.number="powerMeter.Voltage"
                    @input="modelChanged">
            </fg-input>
            <fg-input type="number"
                    label="AdjustmentFactor"
                    placeholder="AdjustmentFactor"
                    v-model.number="powerMeter.AdjustmentFactor"
                    @input="modelChanged">
            </fg-input>
          </form>
          </div>
          </div>
        </div>        
    </div>    
</template>
  
<script>
export default {
  props: ['powerMeter'],
  methods: {
    modelChanged: function () {
      this.$emit('powerMeterModified', this.powerMeter)
    }
  }
}
</script>

<style>
</style>
