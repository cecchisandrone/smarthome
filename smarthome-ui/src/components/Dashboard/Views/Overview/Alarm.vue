<template>
    <stats-card>
        <template #header>
          <div class="icon-success">
            <h3>Alarm</h3>
          </div>
        </template>
        <template #content>
          <div class="numbers">
            <button class="btn btn-default btn-md" v-bind:class="{ active: isActive }" v-on:click="toggleAlarm">
              {{ status }}
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
  import * as alarmService from 'src/services/alarmService.js'
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
      toggleAlarm: function () {
        const that = this
        alarmService.toggleAlarm(!this.isActive).then((data) => {
          that.isActive = !that.isActive
          that.messages = that.getMessage(that.isActive, data.cameras)
        })
        .catch((err) => {
          that.messages = err.message
        })
      },
      getMessage: function (enabled, cameras) {
        let message = ''
        if (enabled && cameras.length) {
          message = 'Enabled on ' + cameras
        }
        if (enabled && !cameras.length) {
          message = 'Enabled but no camera enabled'
        }
        return message
      }
    },
    created () {
      const that = this
      alarmService.getAlarmStatus().then((data) => {
        that.isActive = data.alarmEnabled
        that.messages = that.getMessage(data.alarmEnabled, data.cameras)
      })
      .catch((err) => {
        that.messages = err.message
        that.isActive = false
      })
    }
  }
</script>
