<template>
  <div id="app-4">
    <div class="row">
      <div class="col-md-12">
        <div class="card">
          <div class="content table-responsive table-full-width">
            <table class="table table-Striped">
              <thead>
                <th v-for="column in cameraTable.columns">{{column}}</th>
              </thead>
              <tbody>
                <tr v-for="item in cameraTable.data">
                  <td v-for="column in cameraTable.columns" >{{ item[column] }}</td>
                  <td>
                    <button class="btn btn-info btn-fill btn-wd" v-on:click="editCamera(item)">
                      Edit
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>  
        </div>
      </div>
    </div>
    <modal v-if="showModal" @close="showModal = false">
      <!--
        you can use custom content here to overwrite
        default content
      -->
      <h3 slot="header">custom header</h3>
      <div slot="body">
        This is a custom body
      </div>
    </modal>
  </div>
</template>
<script>
  import * as configurationService from 'src/services/configurationService.js'

  export default {
    data () {
      return {
        configuration: [],
        cameraTable: {
          title: 'Cameras',
          columns: ['ID', 'Name'],
          data: [...[]]
        },
        showModal: false
      }
    },
    methods: {
      editCamera: function (camera) {
        console.log(camera)
        this.showModal = true
      }
    },
    created () {
      var app = this
      configurationService.getConfiguration().then((data) => {
        app.configuration = data
        app.cameraTable.data = data.Cameras
      })
      .catch((err) => {
        console.log(err)
      })
    }
  }

</script>
<style>
</style>
