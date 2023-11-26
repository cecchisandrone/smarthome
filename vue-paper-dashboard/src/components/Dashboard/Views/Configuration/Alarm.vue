<template>
    <div>
        <h3>Alarm</h3>
        <div class="card">
          <div class="container">
            <div class="row">
              <form class="col-md-4">
                <label>
                  <input type='checkbox' v-model="alarm.AutomaticAlarmActivation" @change="modelChanged"/>
                  Automatic alarm activation
                </label>
              </form>
            </div>
          </div>
        </div>        
    </div>    
</template>
  
<script>
export default {
  props: ['alarm'],
  methods: {
    modelChanged: function () {
      this.$emit('alarmModified', this.alarm)
    }
  }
}
</script>

<style>
</style>
