<template>
    <stats-card>
        <div class="icon-big icon-success" slot="header">
          Gate
        </div>
        <div class="numbers" slot="content">        
          <button class="btn btn-default btn-md" v-on:click="openGate">
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
        messages: ''
      }
    },
    methods: {
      openGate: function () {
        var that = this
        gateService.open().then((data) => {
          that.messages = 'Gate opened'
        })
        .catch((err) => {
          that.messages = err.message
        })
      }
    }
  }
</script>
