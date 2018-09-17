<template>
    <div>
        <h3>Humidity</h3>
        <div class="card">
          <div class="container">
          <div class="row">
          <form class="col-md-4">
            <fg-input type="text"
                    label="Host"
                    placeholder="Host"
                    v-model="humidity.Host"
                    @input="modelChanged">
            </fg-input>
            <fg-input type="number"
                    label="Port"
                    placeholder="Port"
                    v-model.number="humidity.Port"
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
  props: ['humidity'],
  methods: {
    modelChanged: function () {
      this.$emit('humidityModified', this.humidity)
    }
  }
}
</script>

<style>
</style>
