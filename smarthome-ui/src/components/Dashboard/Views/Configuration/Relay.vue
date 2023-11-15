<template>
  <div>    
    <div class="row">        
      <div class="col-md-12">
        <h3>Relays</h3>
        <div class="card">          
          <div class="content table-responsive table-full-width">
            <table class="table table-Striped">
              <thead>
                <th v-for="column in relayTable.columns">{{column}}</th>
              </thead>
              <tbody>
                <tr v-for="item in relayTable.data">
                  <td v-for="column in relayTable.columns" >{{ item[column] }}</td>
                  <td>
                    <button class="btn btn-sm" v-on:click="editRelay(item)">
                      Edit
                    </button>
                    <button class="btn btn-danger btn-sm" v-on:click="deleteRelay(item)">
                      Delete
                    </button>
                  </td>                  
                </tr>
              </tbody>
            </table>
          </div>
          <button style="margin: 10px" class="btn btn-success" v-on:click="editRelay({})">
            Create
          </button>  
        </div>
      </div>
    </div>
    <modal v-if="showModal" @close="showModal = false">            
      <h3 slot="header">
        Relay: {{ selectedRelay.Name }}    
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
                      v-model="selectedRelay.ID"
                      :disabled="true">
            </fg-input>
          </div>
        </div>
        <div class="row">
          <div class="col-md-12">
            <fg-input type="text"
                      label="Name"                      
                      placeholder="Name"
                      v-model="selectedRelay.Name">
            </fg-input>
          </div>
        </div>
        <div class="row">
          <div class="col-md-12">
            <fg-input type="text"
                      label="Host"
                      placeholder="Host"
                      v-model="selectedRelay.Host">
            </fg-input>
          </div>
        </div>
        <div class="row">
          <div class="col-md-12">
            <fg-input type="number"
                      label="Port"
                      placeholder="Port"
                      v-model.number="selectedRelay.Port">
            </fg-input>
          </div>
        </div>
        <div class="row">
          <div class="col-md-12">
            <fg-input type="number"
                      label="Channels"
                      placeholder="Channels"
                      v-model.number="selectedRelay.Channels">
            </fg-input>
          </div>
        </div>
        <div class="row">
          <div class="col-md-12">
            <fg-input type="text"
                      label="Activation intervals"
                      placeholder="Activation intervals"
                      v-model="selectedRelay.ActivationIntervals">
            </fg-input>
          </div>
        </div>
        <div>
          <label>
            <input type='checkbox' v-model="selectedRelay.AutomaticActivationEnabled"/>
            Automatic activation enabled
          </label>
        </div>
      </div>
      <div slot="footer">
        <button class="btn btn-info" v-on:click="createOrUpdateRelay()">
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
  import * as relayService from 'src/services/relayService.js'
  import Simplert from 'vue2-simplert'
  export default {
    components: {
      Simplert
    },
    props: ['configuration'],
    data () {
      return {
        showModal: false,
        selectedRelay: null,
        modalErrors: null
      }
    },
    computed: {
      relayTable: function () {
        var relays = []
        if (this.configuration.Relays) {
          relays = this.configuration.Relays
        }
        return {
          title: 'Relays',
          columns: ['ID', 'Name', 'Host', 'Port', 'Channels', 'ActivationIntervals', 'AutomaticActivationEnabled'],
          data: relays
        }
      }
    },
    methods: {
      editRelay: function (relay) {
        this.showModal = true
        this.selectedRelay = relay
      },
      createOrUpdateRelay: function () {
        if (this.selectedRelay.ID) {
          relayService.updateRelay(this.selectedRelay).then((data) => {
            this.showModal = false
            this.$notifications.notify({message: 'Relay updated successfully', horizontalAlign: 'center', verticalAlign: 'top', type: 'success'})
          }).catch((err) => {
            this.$notifications.notify({message: err.message, horizontalAlign: 'center', verticalAlign: 'top', type: 'danger'})
          })
        } else {
          relayService.createRelay(this.selectedRelay).then((data) => {
            this.showModal = false
            this.$notifications.notify({message: 'Relay created successfully', horizontalAlign: 'center', verticalAlign: 'top', type: 'success'})
            this.$emit('loadConfiguration')
          }).catch((err) => {
            this.$notifications.notify({message: err.message, horizontalAlign: 'center', verticalAlign: 'top', type: 'danger'})
          })
        }
      },
      deleteRelay: function (relay) {
        let that = this
        let confirmFn = function () {
          relayService.deleteRelay(relay).then((data) => {
            that.$notifications.notify({message: 'Relay deleted successfully', horizontalAlign: 'center', verticalAlign: 'top', type: 'success'})
            that.$emit('loadConfiguration')
          }).catch((err) => {
            that.$notifications.notify({message: err.message, horizontalAlign: 'center', verticalAlign: 'top', type: 'danger'})
          })
        }
        let obj = {
          title: 'Delete relay ' + relay.Name + '?',
          message: 'Are you sure do you want do delete relay ' + relay.Name + '?',
          type: 'warning',
          useConfirmBtn: true,
          onConfirm: confirmFn
        }
        this.$refs.simplert.openSimplert(obj)
      }
    }
  }

</script>
