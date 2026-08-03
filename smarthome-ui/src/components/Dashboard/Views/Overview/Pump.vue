<template>
  <stats-card>
    <template #header>
      <div class="icon-success">
        <h3>Basement Pump</h3>
      </div>
    </template>
    <template #content>
      <div class="numbers">
        <button class="btn btn-default btn-md" v-bind:class="{ active: isActive }" v-on:click="togglePump">
          <span>{{ status }}</span>
        </button>
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
        const that = this
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
      const that = this
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
