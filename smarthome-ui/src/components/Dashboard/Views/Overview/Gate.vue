<template>
    <stats-card>
        <div class="icon-success" slot="header">
          <h3>Gate</h3>
        </div>
        <div class="numbers" slot="content">        
          <button class="btn btn-default btn-md" v-bind:class="{ active: isActive }" v-on:click="openGate">
            Open
          </button>
        </div>
        <div class="stats" slot="footer">
        <i v-if="messages" class="ti-info"></i> {{messages}}
        </div>
    </stats-card>
</template>
<script>
  import StatsCard from 'components/UIComponents/Cards/StatsCard.vue'
  import * as gateService from 'src/services/gateService.js'
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
    methods: {
      openGate: function () {
        var that = this
        gateService.open().then((data) => {
          that.messages = 'Gate opened'
          that.isActive = true
          setTimeout(function () {
            that.isActive = false
            that.messages = ''
          }, 3000)
        })
        .catch((err) => {
          that.messages = err.message
          that.isActive = false
        })
      }
    }
  }
</script>
