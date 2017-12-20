<template>
    <div>
        <h3>Slack</h3>
        <div class="card">
          <div class="container">
          <div class="row">
          <form class="col-md-4">
            <fg-input type="text"
                        label="Notification channel"
                        placeholder="Notification channel"
                        v-model="slack.NotificationChannel"
                        @input="modelChanged">
                </fg-input>
                <fg-input type="text"
                        label="Location change channel"
                        placeholder="Location change channel"
                        v-model.number="slack.LocationChangeChannel"
                        @input="modelChanged">
                </fg-input>
                <fg-input type="text"
                        label="Token"
                        placeholder="Token"
                        v-model.number="slack.Token"                        
                        @input="modelChanged">
                </fg-input>
                <fg-input type="text"
                        label="Location change users"
                        placeholder="Location change users"
                        v-model.number="slack.LocationChangeUsers"                        
                        @input="modelChanged">
                </fg-input>
                <button style="margin: 10px" class="btn btn-success" v-on:click="testSlackSettings">
                  Test
                </button>
          </form>
          </div>
          </div>
        </div>        
    </div>    
</template>
  
<script>
import * as notificationService from 'src/services/notificationService.js'
export default {
  props: ['slack'],
  methods: {
    modelChanged: function () {
      this.$emit('slackModified', this.slack)
      console.log(this.slack)
    },
    testSlackSettings: function () {
      var that = this
      notificationService.testSlackNotification().then(function (res) {
        that.$notifications.notify(
          {
            message: 'Configuration is correct',
            icon: 'ti-info',
            horizontalAlign: 'center',
            verticalAlign: 'top',
            type: 'success'
          })
      }).catch(function (err) {
        that.$notifications.notify(
          {
            message: err,
            icon: 'ti-error',
            horizontalAlign: 'center',
            verticalAlign: 'top',
            type: 'danger'
          })
      })
    }
  }
}
</script>

<style>
</style>
