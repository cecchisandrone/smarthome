<template>
    <stats-card>
        <template #header>
          <div class="icon-success">
            <h3>Gate</h3>
          </div>
        </template>
        <template #content>
          <div class="numbers">
            <button class="btn btn-default btn-md" v-bind:class="{ active: isActive }" v-on:click="openGate">
              Open
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
        const that = this
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
