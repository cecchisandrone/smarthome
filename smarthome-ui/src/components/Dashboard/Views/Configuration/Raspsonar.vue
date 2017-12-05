<template>
    <div>
        <h3>Raspsonar</h3>
        <div class="card">
          <div class="container">
          <div class="row">
          <form class="col-md-4">
            <fg-input type="text"
                    label="Host"
                    placeholder="Host"
                    v-model="raspsonar.Host"
                    @input="modelChanged">
            </fg-input>
            <fg-input type="number"
                    label="Port"
                    placeholder="Port"
                    v-model.number="raspsonar.Port"
                    @input="modelChanged">
            </fg-input>
            <fg-input type="number"
                    label="Sonar index"
                    placeholder="Sonar index"
                    v-model.number="raspsonar.SonarIndex"
                    @input="modelChanged">
            </fg-input>
            <fg-input type="number"
                    label="Relay index"
                    placeholder="Relay index"
                    v-model.number="raspsonar.RelayIndex"                        
                    @input="modelChanged">
            </fg-input>
            <fg-input type="number"
                    label="Distance threshold"
                    placeholder="Distance threshold"
                    v-model.number="raspsonar.DistanceThreshold"                        
                    @input="modelChanged"
                    step="0.1">
            </fg-input>
            <fg-input type="number"
                    label="Auto power off distance threshold"
                    placeholder="Auto power off distance threshold"
                    v-model.number="raspsonar.AutoPowerOffDistanceThreshold"                        
                    @input="modelChanged"
                    step="0.1">
            </fg-input>
          </form>
          </div>
          </div>
        </div>        
    </div>    
</template>
  
<script>
export default {
  props: ['raspsonar'],
  methods: {
    modelChanged: function () {
      this.$emit('raspsonarModified', this.raspsonar)
      console.log(this.raspsonar)
    }
  }
}
</script>

<style>
</style>
