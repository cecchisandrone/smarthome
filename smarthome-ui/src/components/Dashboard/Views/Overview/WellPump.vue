<template>
  <stats-card>
    <div class="icon-success" slot="header">
      <h3>Well Pumps</h3>
    </div>
    <div class="numbers" slot="content">
      <button v-for="wellPump in wellPumps" class="btn btn-default btn-md" v-bind:class="{ active: getStatus(wellPump.Name) == 'On' }" v-on:click="togglePump(wellPump.ID, wellPump.Name)">
        <span>{{ getStatus(wellPump.Name) }} ({{ wellPump.Name}})</span>
      </button>
    </div>
    <div class="stats" slot="footer">
      <i v-if="messages" class="ti-info"></i> {{messages}}
    </div>
  </stats-card>
</template>
<script>
  import StatsCard from 'components/UIComponents/Cards/StatsCard.vue'
  import * as wellPumpService from 'src/services/wellPumpService.js'
  import * as configurationService from 'src/services/configurationService.js'
  export default {
    components: {
      StatsCard
    },
    data () {
      return {
        messages: '',
        wellPumps: null,
        wellPumpsStatus: {}
      }
    },
    methods: {
      init: function () {
        var that = this
        configurationService.getConfiguration().then((data) => {
          that.wellPumps = data.WellPumps
          for (var i = 0; i < data.WellPumps.length; i++) {
            let name = data.WellPumps[i].Name
            let id = data.WellPumps[i].ID
            wellPumpService.getWellPumpRelay(id).then((data2) => {
              that.$set(that.wellPumpsStatus, name, data2.status)
            })
            .catch((err) => {
              that.$set(that.wellPumpsStatus, name, -1)
              that.messages += name + ': ' + err.message
            })
          }
        })
        .catch((err) => {
          that.messages = err.message
        })
      },
      togglePump: function (wellPumpId, wellPumpName) {
        let status = this.wellPumpsStatus[wellPumpName]
        var that = this
        wellPumpService.toggleWellPumpRelay(wellPumpId, status ^ 1, !!(status ^ 1)).then((data) => {
          if (data.status) {
            that.messages = 'Well Pump ' + wellPumpName + ' activated'
          } else {
            that.messages = 'Well Pump ' + wellPumpName + ' deactivated'
          }
          that.init()
        })
        .catch((err) => {
          that.$set(that.wellPumpsStatus, name, -1)
          that.messages += name + ': ' + err.message
        })
      },
      getStatus: function (wellPumpName) {
        switch (this.wellPumpsStatus[wellPumpName]) {
          case 0:
            return 'Off'
          case 1:
            return 'On'
          case -1:
            return 'Err'
        }
      }
    },
    created () {
      this.init()
    }
  }
</script>
