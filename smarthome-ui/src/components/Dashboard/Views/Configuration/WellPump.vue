<template>
  <div>    
    <div class="row">        
      <div class="col-md-12">
        <h3>Well Pumps</h3>
        <div class="card">          
          <div class="content table-responsive table-full-width">
            <table class="table table-Striped">
              <thead>
                <th v-for="column in wellPumpTable.columns">{{column}}</th>
              </thead>
              <tbody>
                <tr v-for="item in wellPumpTable.data">
                  <td v-for="column in wellPumpTable.columns" >{{ item[column] }}</td>
                  <td>
                    <button class="btn btn-sm" v-on:click="editWellPump(item)">
                      Edit
                    </button>
                    <button class="btn btn-danger btn-sm" v-on:click="deleteWellPump(item)">
                      Delete
                    </button>
                  </td>                  
                </tr>
              </tbody>
            </table>
          </div>
          <button style="margin: 10px" class="btn btn-success" v-on:click="editWellPump({})">
            Create
          </button>  
        </div>
      </div>
    </div>
    <modal v-if="showModal" @close="showModal = false">            
      <h3 slot="header">
        WellPump: {{ selectedWellPump.Name }}    
      </h3>
      <div slot="body">
        <h5 v-show="modalErrors !==''" class="text-danger">
          {{ modalErrors }}
        </h5>
        <div class="row">
          <div class="col-md-12">
            <fg-input type="text"
                      label="ID"
                      placeholder="ID"
                      v-model="selectedWellPump.ID"
                      :disabled="true">
            </fg-input>
          </div>
        </div>
        <div class="row">
          <div class="col-md-12">
            <fg-input type="text"
                      label="Name"                      
                      placeholder="Name"
                      v-model="selectedWellPump.Name">
            </fg-input>
          </div>
        </div>
        <div class="row">
          <div class="col-md-12">
            <fg-input type="text"
                      label="Host"
                      placeholder="Host"
                      v-model="selectedWellPump.Host">
            </fg-input>
          </div>
        </div>
        <div class="row">
          <div class="col-md-12">
            <fg-input type="number"
                      label="Port"
                      placeholder="Port"
                      v-model.number="selectedWellPump.Port">
            </fg-input>
          </div>
        </div>
        <div>
          <label>
            <input type='checkbox' v-model="selectedWellPump.Enabled"/>
            Enabled
          </label>
        </div>
      </div>
      <div slot="footer">
        <button class="btn btn-info" v-on:click="createOrUpdateWellPump()">
          Save
        </button>
      </div>      
    </modal>
    <simplert :useRadius="true"
              :useIcon="true"
              ref="simplert">
    </simplert>
  </div>
</template>
<script>
  import * as wellPumpService from 'src/services/wellPumpService.js'
  import Simplert from 'vue2-simplert'
  export default {
    components: {
      Simplert
    },
    props: ['configuration'],
    data () {
      return {
        showModal: false,
        selectedWellPump: null,
        modalErrors: null
      }
    },
    computed: {
      wellPumpTable: function () {
        var wellPumps = []
        if (this.configuration.WellPumps) {
          wellPumps = this.configuration.WellPumps
        }
        return {
          title: 'WellPumps',
          columns: ['ID', 'Name', 'Host', 'Port', 'Enabled'],
          data: wellPumps
        }
      }
    },
    methods: {
      editWellPump: function (wellPump) {
        this.showModal = true
        this.selectedWellPump = wellPump
      },
      createOrUpdateWellPump: function () {
        if (this.selectedWellPump.ID) {
          wellPumpService.updateWellPump(this.selectedWellPump).then((data) => {
            this.showModal = false
            this.$notifications.notify({message: 'WellPump updated successfully', horizontalAlign: 'center', verticalAlign: 'top', type: 'success'})
          }).catch((err) => {
            this.$notifications.notify({message: err.message, horizontalAlign: 'center', verticalAlign: 'top', type: 'danger'})
          })
        } else {
          wellPumpService.createWellPump(this.selectedWellPump).then((data) => {
            this.showModal = false
            this.$notifications.notify({message: 'WellPump created successfully', horizontalAlign: 'center', verticalAlign: 'top', type: 'success'})
            this.$emit('loadConfiguration')
          }).catch((err) => {
            this.$notifications.notify({message: err.message, horizontalAlign: 'center', verticalAlign: 'top', type: 'danger'})
          })
        }
      },
      deleteWellPump: function (wellPump) {
        let that = this
        let confirmFn = function () {
          wellPumpService.deleteWellPump(wellPump).then((data) => {
            that.$notifications.notify({message: 'WellPump deleted successfully', horizontalAlign: 'center', verticalAlign: 'top', type: 'success'})
            that.$emit('loadConfiguration')
          }).catch((err) => {
            that.$notifications.notify({message: err.message, horizontalAlign: 'center', verticalAlign: 'top', type: 'danger'})
          })
        }
        let obj = {
          title: 'Delete wellPump ' + wellPump.Name + '?',
          message: 'Are you sure do you want do delete wellPump ' + wellPump.Name + '?',
          type: 'warning',
          useConfirmBtn: true,
          onConfirm: confirmFn
        }
        this.$refs.simplert.openSimplert(obj)
      }
    }
  }

</script>
