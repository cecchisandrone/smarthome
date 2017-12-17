<template>
  <stats-card>
    <div class="icon-big icon-success" slot="header">
      Pump
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
        raspsonarService.togglePump(that.isActive).then((data) => {
          that.isActive = !that.isActive
          if (that.isActive) {
            that.messages = 'Pump activated at ' + new Date().toLocaleTimeString()
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
  }
</script>
