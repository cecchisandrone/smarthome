<template>
    <div>
        <h3>Gate</h3>
        <div class="card">
          <div class="container">
          <div class="row">
          <form class="col-md-4">
            <fg-input type="text"
                        label="Host"
                        placeholder="Host"
                        v-model="gate.Host"
                        @input="modelChanged">
                </fg-input>
                <fg-input type="number"
                        label="Port"
                        placeholder="Port"
                        v-model.number="gate.Port"
                        @input="modelChanged">
                </fg-input>
                <fg-input type="number"
                        label="Duration"
                        placeholder="Duration"
                        v-model.number="gate.Duration"
                        step="0.01"
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
  props: ['configuration'],
  computed: {
    gate: function () {
      var gate = {}
      if (this.configuration && this.configuration.Gate) {
        gate = this.configuration.Gate
      }
      return gate
    }
  },
  methods: {
    modelChanged: function () {
      this.$emit('gateModified', this.gate)
    }
  }
}
</script>

<style>
</style>
