<template>
  <div>    
    <div class="row">        
      <div class="col-md-12">
        <h3>Inverters</h3>
        <div class="card">          
          <div class="content table-responsive table-full-width">
            <table class="table table-Striped">
              <thead>
                <th v-for="column in inverterTable.columns">{{column}}</th>
              </thead>
              <tbody>
                <tr v-for="item in inverterTable.data">
                  <td v-for="column in inverterTable.columns" >{{ item[column] }}</td>
                  <td>
                    <button class="btn btn-sm" v-on:click="editInverter(item)">
                      Edit
                    </button>
                    <button class="btn btn-danger btn-sm" v-on:click="deleteInverter(item)">
                      Delete
                    </button>
                  </td>                  
                </tr>
              </tbody>
            </table>
          </div>
          <button style="margin: 10px" class="btn btn-success" v-on:click="editInverter({})">
            Create
          </button>  
        </div>
      </div>
    </div>
    <modal v-if="showModal" @close="showModal = false">            
      <h3 slot="header">
        Inverter: {{ selectedInverter.Name }}    
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
                      v-model="selectedInverter.ID"
                      :disabled="true">
            </fg-input>
          </div>
        </div>
        <div class="row">
          <div class="col-md-12">
            <fg-input type="text"
                      label="Name"                      
                      placeholder="Name"
                      v-model="selectedInverter.Name">
            </fg-input>
          </div>
        </div>
        <div class="row">
          <div class="col-md-12">
            <fg-input type="text"
                      label="Host"
                      placeholder="Host"
                      v-model="selectedInverter.Host">
            </fg-input>
          </div>
        </div>
        <div class="row">
          <div class="col-md-12">
            <fg-input type="number"
                      label="Port"
                      placeholder="Port"
                      v-model.number="selectedInverter.Port">
            </fg-input>
          </div>
        </div>        
      </div>
      <div slot="footer">
        <button class="btn btn-info" v-on:click="createOrUpdateInverter()">
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
  import * as inverterService from 'src/services/inverterService.js'
  import Simplert from 'vue2-simplert'
  export default {
    components: {
      Simplert
    },
    props: ['configuration'],
    data () {
      return {
        showModal: false,
        selectedInverter: null,
        modalErrors: null
      }
    },
    computed: {
      inverterTable: function () {
        var inverters = []
        if (this.configuration.Inverters) {
          inverters = this.configuration.Inverters
        }
        return {
          title: 'Inverters',
          columns: ['ID', 'Name', 'Host', 'Port'],
          data: inverters
        }
      }
    },
    methods: {
      editInverter: function (Inverter) {
        this.showModal = true
        this.selectedInverter = Inverter
      },
      createOrUpdateInverter: function () {
        if (this.selectedInverter.ID) {
          inverterService.updateInverter(this.selectedInverter).then((data) => {
            this.showModal = false
            this.$notifications.notify({message: 'Inverter updated successfully', horizontalAlign: 'center', verticalAlign: 'top', type: 'success'})
          }).catch((err) => {
            this.$notifications.notify({message: err.message, horizontalAlign: 'center', verticalAlign: 'top', type: 'danger'})
          })
        } else {
          inverterService.createInverter(this.selectedInverter).then((data) => {
            this.showModal = false
            this.$notifications.notify({message: 'Inverter created successfully', horizontalAlign: 'center', verticalAlign: 'top', type: 'success'})
            this.$emit('loadConfiguration')
          }).catch((err) => {
            this.$notifications.notify({message: err.message, horizontalAlign: 'center', verticalAlign: 'top', type: 'danger'})
          })
        }
      },
      deleteInverter: function (Inverter) {
        let that = this
        let confirmFn = function () {
          inverterService.deleteInverter(Inverter).then((data) => {
            that.$notifications.notify({message: 'Inverter deleted successfully', horizontalAlign: 'center', verticalAlign: 'top', type: 'success'})
            that.$emit('loadConfiguration')
          }).catch((err) => {
            that.$notifications.notify({message: err.message, horizontalAlign: 'center', verticalAlign: 'top', type: 'danger'})
          })
        }
        let obj = {
          title: 'Delete Inverter ' + Inverter.Name + '?',
          message: 'Are you sure do you want do delete Inverter ' + Inverter.Name + '?',
          type: 'warning',
          useConfirmBtn: true,
          onConfirm: confirmFn
        }
        this.$refs.simplert.openSimplert(obj)
      }
    }
  }

</script>
