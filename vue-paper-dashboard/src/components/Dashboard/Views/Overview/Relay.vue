<template>
  <stats-card>
    <div class="icon-success" slot="header">
      <h3>Relays</h3>
    </div>
    <div class="numbers" slot="content">
      <div v-for='relay in relays' v-bind:key='relay.name'>
        <div>{{ relay.Name }} ({{ getGlobalStatus(relay.Name) }})</div>
        <span v-for="channel in relay.Channels" :key="channel">
          <button v-if="getGlobalStatus(relay.Name) == 'Ok'" class="btn btn-default btn-sm" v-bind:class="{ active: getStatus(relay.Name, channel) == true }" v-on:click="toggleRelay(relay.ID, relay.Name, channel)">
            <span>{{ channel}}</span>
          </button>
        </span>
      </div>
    </div>
    <div class="stats" slot="footer">
      <i v-if="messages" class="ti-info"></i> {{messages}}
    </div>
  </stats-card>
</template>
<script>
  import StatsCard from '@/components/Cards/StatsCard.vue'
  import * as relayService from '@/services/relayService.js'
  import * as configurationService from '@/services/configurationService.js'
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
        var that = this
        configurationService.getConfiguration().then((data) => {
          that.relays = data.Relays
          for (var i = 0; i < data.Relays.length; i++) {
            let name = data.Relays[i].Name
            let id = data.Relays[i].ID
            relayService.getRelay(id).then((data2) => {
              that.$set(that.relaysStatus, name, data2.status)
            })
            .catch((err) => {
              that.$set(that.relaysStatus, name, -1)
              that.messages += name + ': ' + err.message
            })
          }
        })
        .catch((err) => {
          that.messages = err.message
        })
      },
      toggleRelay: function (relayId, relayName, channel) {
        let status = this.relaysStatus[relayName]
        status[channel - 1] = !status[channel - 1]
        var that = this
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
          that.$set(that.relaysStatus, name, -1)
          that.messages += name + ': ' + err.message
        })
      },
      getStatus: function (relayName, channel) {
        if (this.getGlobalStatus(relayName) === 'Ok') {
          return this.relaysStatus[relayName][channel - 1]
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
