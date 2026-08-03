<template>
  <stats-card>
    <template #header>
      <div class="icon-success">
        <h3>Relays</h3>
      </div>
    </template>
    <template #content>
      <div class="numbers">
        <div v-for='relay in relays' v-bind:key='relay.name'>
          <div>{{ relay.Name }} ({{ getGlobalStatus(relay.Name) }})</div>
          <span v-for="channel in relay.Channels" :key="channel">
            <button v-if="getGlobalStatus(relay.Name) == 'Ok'" class="btn btn-default btn-sm" v-bind:class="{ active: getStatus(relay.Name, channel) == true }" v-on:click="toggleRelay(relay.ID, relay.Name, channel)">
              <span>{{ channel}}</span>
            </button>
            <span> </span>
          </span>
        </div>
      </div>
    </template>
    <template #footer>
      <div class="stats">
        <i v-if="messages" class="ti-info"></i> {{messages}}
      </div>
    </template>
  </stats-card>
</template>
<script>
  import StatsCard from 'components/UIComponents/Cards/StatsCard.vue'
  import * as relayService from 'src/services/relayService.js'
  import * as configurationService from 'src/services/configurationService.js'
  export default {
    components: {
      StatsCard
    },
    data () {
      return {
        messages: '',
        relays: null,
        relaysStatus: {}
      }
    },
    methods: {
      init: function () {
        const that = this
        configurationService.getConfiguration().then((data) => {
          that.relays = data.Relays
          for (let i = 0; i < data.Relays.length; i++) {
            const name = data.Relays[i].Name
            const id = data.Relays[i].ID
            relayService.getRelay(id).then((data2) => {
              that.relaysStatus[name] = data2.status
            })
            .catch((err) => {
              that.relaysStatus[name] = -1
              that.messages += name + ': ' + err.message
            })
          }
        })
        .catch((err) => {
          that.messages = err.message
        })
      },
      toggleRelay: function (relayId, relayName, channel) {
        const status = this.relaysStatus[relayName]
        status[channel - 1] = !status[channel - 1]
        const that = this
        let manuallyActivated = true
        if (Object.values(status).every(val => {
          return val === false
        })) {
          manuallyActivated = false
        }
        relayService.toggleRelay(relayId, status, manuallyActivated).then((data) => {
          if (data[channel - 1]) {
            that.messages = 'Relay ' + relayName + '(' + channel + ') activated'
          } else {
            that.messages = 'Relay ' + relayName + '(' + channel + ') deactivated'
          }
          that.init()
        })
        .catch((err) => {
          that.relaysStatus[name] = -1
          that.messages += name + ': ' + err.message
        })
      },
      getStatus: function (relayName, channel) {
        // getGlobalStatus() reports 'Ok' before the per-relay GET has resolved,
        // so the status has to be checked here too. Vue 2 caught the resulting
        // TypeError and logged it; Vue 3 rethrows it as an uncaught exception.
        const status = this.relaysStatus[relayName]
        if (status !== undefined && status !== -1) {
          return status[channel - 1]
        }
      },
      getGlobalStatus: function (relayName) {
        if (this.relaysStatus[relayName] === -1) {
          return 'Err'
        } else {
          return 'Ok'
        }
      }
    },
    created () {
      this.init()
    }
  }
</script>
