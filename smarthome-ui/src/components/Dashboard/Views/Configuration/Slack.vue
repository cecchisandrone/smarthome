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
          </form>
          </div>
          </div>
        </div>        
    </div>    
</template>
  
<script>
export default {
  props: ['slack'],
  methods: {
    modelChanged: function () {
      this.$emit('slackModified', this.slack)
      console.log(this.slack)
    }
  }
}
</script>

<style>
</style>
