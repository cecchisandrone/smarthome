<template>
  <stats-card>
    <div class="icon-success" slot="header">
      <h3>Basement Pump</h3>
    </div>
    <div class="numbers" slot="content">        
      <button class="btn btn-default btn-md" v-bind:class="{ active: isActive }" v-on:click="togglePump">
        <span>{{ status }}</span>
      </button>
    </div>
    <div class="stats" slot="footer">
      <i v-if="messages" class="ti-info"></i> {{messages}}
    </div>
  </stats-card>
</template>
<script>
  import StatsCard from 'components/UIComponents/Cards/StatsCard.vue'
  import * as raspsonarService from 'src/services/raspsonarService.js'
  export default {
    components: {
      StatsCard
    },
    data () {
      return {
        messages: '',
        isActive: false
      }
    },
    computed: {
      status: function () {
        return this.isActive ? 'On' : 'Off'
      }
    },
    methods: {
      togglePump: function () {
        var that = this
        raspsonarService.toggleRelay(!that.isActive).then((data) => {
          that.isActive = data.relayStatus
          if (that.isActive) {
            that.messages = 'Pump activated at ' + new Date(data.activationTime).toLocaleTimeString()
          } else {
            that.messages = ''
          }
        })
        .catch((err) => {
          that.messages = err.message
          that.isActive = false
        })
      }
    },
    created () {
      var that = this
      raspsonarService.getRelayStatus().then((data) => {
        that.isActive = data.relayStatus
        if (that.isActive) {
          that.messages = 'Pump activated at ' + new Date(data.activationTime).toLocaleTimeString()
        } else {
          that.messages = ''
        }
      })
      .catch((err) => {
        that.messages = err.message
        that.isActive = false
      })
    }
  }
</script>
