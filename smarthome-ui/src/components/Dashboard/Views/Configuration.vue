<template>
  <div id="app-4">
    <h5 v-show="errors !==''" class="text-danger">
      {{ errors }}
    </h5>
    <div class="row">
      <div class="col-md-12">
        <div class="card">
          <div class="header">
            <h4 class="title">Cameras</h4>
          </div>
          <div class="content table-responsive table-full-width">
            <table class="table table-Striped">
              <thead>
                <th v-for="column in cameraTable.columns">{{column}}</th>
              </thead>
              <tbody>
                <tr v-for="item in cameraTable.data">
                  <td v-for="column in cameraTable.columns" >{{ item[column] }}</td>
                  <td>
                    <button class="btn btn-sm" v-on:click="editCamera(item)">
                      Edit
                    </button>
                    <button class="btn btn-danger btn-sm" v-on:click="deleteCamera(item)">
                      Delete
                    </button>
                  </td>                  
                </tr>
              </tbody>
            </table>
          </div>
          <button style="margin: 10px" class="btn btn-success" v-on:click="editCamera({})">
            Create
          </button>  
        </div>
      </div>
    </div>
    <modal v-if="showModal" @close="showModal = false">            
      <h3 slot="header">
        Camera: {{ selectedCamera.Name }}    
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
                      v-model="selectedCamera.ID"
                      :disabled="true">
            </fg-input>
          </div>
        </div>
        <div class="row">
          <div class="col-md-12">
            <fg-input type="text"
                      label="Name"                      
                      placeholder="Name"
                      v-model="selectedCamera.Name">
            </fg-input>
          </div>
        </div>
        <div class="row">
          <div class="col-md-12">  
            <div class="form-group">        
              <label>Type</label>
              <select label="asd" class="form-control border-input" v-model="selectedCamera.Type">
                <option disabled value="">Please select camera type</option>
                <option value="foscam">Foscam</option>
                <option value="adj">ADJ</option>
                <option value="microcam">Microcam</option>
              </select>
            </div>
          </div>
        </div>  
        <div class="row">
          <div class="col-md-12">
            <fg-input type="text"
                      label="Host"
                      placeholder="Host"
                      v-model="selectedCamera.Host">
            </fg-input>
          </div>
        </div>
        <div class="row">
          <div class="col-md-12">
            <fg-input type="number"
                      label="Port"
                      placeholder="Port"
                      v-model.number="selectedCamera.Port">
            </fg-input>
          </div>
        </div>  
        <div class="row">
          <div class="col-md-12">
            <fg-input type="text"
                      label="Username"
                      placeholder="Username"
                      v-model="selectedCamera.Username">
            </fg-input>
          </div>
        </div>  
        <div class="row">
          <div class="col-md-12">
            <fg-input type="password"
                      label="Password"
                      placeholder="Password"
                      v-model="selectedCamera.Password">
            </fg-input>
          </div>
        </div>
        <div>
          <label>
            <input type='checkbox' v-model="selectedCamera.Enabled"/>
            Enabled
          </label>
        </div>        
      </div>
      <div slot="footer">
        <button class="btn btn-info" v-on:click="createOrUpdateCamera()">
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
  import * as configurationService from 'src/services/configurationService.js'
  import * as cameraService from 'src/services/cameraService.js'
  import Simplert from 'vue2-simplert'

  export default {
    components: {
      Simplert
    },
    data () {
      return {
        configuration: [],
        cameraTable: {
          title: 'Cameras',
          columns: ['ID', 'Name', 'Type', 'Host', 'Port', 'Enabled'],
          data: [...[]]
        },
        showModal: false,
        selectedCamera: null,
        errors: null,
        modalErrors: null
      }
    },
    methods: {
      editCamera: function (camera) {
        this.showModal = true
        this.selectedCamera = camera
      },
      createOrUpdateCamera: function () {
        if (this.selectedCamera.ID) {
          cameraService.updateCamera(this.selectedCamera).then((data) => {
            this.showModal = false
            this.$notifications.notify({message: 'Camera updated successfully', horizontalAlign: 'center', verticalAlign: 'top', type: 'success'})
          }).catch((err) => {
            this.$notifications.notify({message: err.message, horizontalAlign: 'center', verticalAlign: 'top', type: 'danger'})
          })
        } else {
          cameraService.createCamera(this.selectedCamera).then((data) => {
            this.showModal = false
            this.$notifications.notify({message: 'Camera created successfully', horizontalAlign: 'center', verticalAlign: 'top', type: 'success'})
            this.loadConfiguration()
          }).catch((err) => {
            this.$notifications.notify({message: err.message, horizontalAlign: 'center', verticalAlign: 'top', type: 'danger'})
          })
        }
      },
      deleteCamera: function (camera) {
        let that = this
        let confirmFn = function () {
          cameraService.deleteCamera(camera).then((data) => {
            this.$notifications.notify({message: 'Camera deleted successfully', horizontalAlign: 'center', verticalAlign: 'top', type: 'success'})
            that.loadConfiguration()
          }).catch((err) => {
            this.$notifications.notify({message: err.message, horizontalAlign: 'center', verticalAlign: 'top', type: 'danger'})
          })
        }
        let obj = {
          title: 'Delete camera ' + camera.Name + '?',
          message: 'Are you sure do you want do delete camera ' + camera.Name + '?',
          type: 'warning',
          useConfirmBtn: true,
          onConfirm: confirmFn
        }
        this.$refs.simplert.openSimplert(obj)
      },
      loadConfiguration: function () {
        var app = this
        configurationService.getConfiguration().then((data) => {
          app.configuration = data
          app.cameraTable.data = data.Cameras
        })
        .catch((err) => {
          app.errors = err.message
        })
      }
    },
    created () {
      this.loadConfiguration()
    }
  }

</script>
<style>
</style>
