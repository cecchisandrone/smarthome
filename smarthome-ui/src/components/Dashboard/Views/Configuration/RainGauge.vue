<template>
    <div>
        <h3>Rain Gauge</h3>
        <div class="card">
          <div class="container">
          <div class="row">
          <form class="col-md-4">
            <fg-input type="text"
                    label="Host"
                    placeholder="Host"
                    v-model="rainGauge.Host"
                    @input="modelChanged">
            </fg-input>
            <fg-input type="number"
                    label="Port"
                    placeholder="Port"
                    v-model.number="rainGauge.Port"
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
  props: ['rainGauge'],
  methods: {
    modelChanged: function () {
      this.$emit('rainGaugeModified', this.rainGauge)
    }
  }
}
</script>

<style>
</style>
