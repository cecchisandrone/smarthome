<template>
    <div>
        <h3>Temperature</h3>
        <div class="card">
          <div class="container">
          <div class="row">
          <form class="col-md-4">
            <fg-input type="text"
                        label="Host"
                        placeholder="Host"
                        v-model="temperature.Host"
                        @input="modelChanged">
                </fg-input>
                <fg-input type="number"
                        label="Port"
                        placeholder="Port"
                        v-model.number="temperature.Port"
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
  props: ['temperature'],
  methods: {
    modelChanged: function () {
      this.$emit('temperatureModified', this.temperature)
      console.log(this.temperature)
    }
  }
}
</script>

<style>
</style>
