<template>
    <div>
        <h3>Heater</h3>
        <div class="card">
          <div class="container">
          <div class="row">
          <form class="col-md-4">
            <fg-input type="text"
                    label="Host"
                    placeholder="Host"
                    v-model="heater.Host"
                    @input="modelChanged">
            </fg-input>
            <fg-input type="number"
                    label="Port"
                    placeholder="Port"
                    v-model.number="heater.Port"
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
  props: ['heater'],
  methods: {
    modelChanged: function () {
      this.$emit('heaterModified', this.heater)
    }
  }
}
</script>

<style>
</style>
