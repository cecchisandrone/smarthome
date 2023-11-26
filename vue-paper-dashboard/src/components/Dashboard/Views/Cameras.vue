<template>
  <div>
    <div v-for="(camera, index) in cameras">
      <div class="col-md-4" v-if="camera.Enabled && (singleCamera == null || camera.Name == singleCamera)">
        <div class="camera-view">
          <div class="camera-name">{{camera.Name}}</div>
          <camera-view :camera="camera"></camera-view>
          <button style="margin: 10px" v-if="singleCamera != null" class="btn btn-sm" v-on:click="toggleSingleCamera(null)">
            Show all cameras
          </button>
          <button style="margin: 10px" v-if="singleCamera == null" class="btn btn-sm" v-on:click="toggleSingleCamera(camera.Name)">
            Show only this camera
          </button>
        </div>
      </div>
    </div>
  </div>  
</template>

<script>
  import Simplert from 'vue2-simplert'
  import * as cameraService from '@/services/cameraService.js'
  import CameraView from '@/components/Dashboard/Views/CameraView.vue'

  export default {
    components: {
      Simplert,
      CameraView
    },
    data () {
      return {
        cameras: {},
        singleCamera: localStorage.getItem('singleCamera')
      }
    },
    methods: {
      toggleSingleCamera: function (name) {
        this.singleCamera = name
        if (name != null) {
          localStorage.setItem('singleCamera', name)
        } else {
          localStorage.removeItem('singleCamera')
        }
      }
    },
    created () {
      var app = this
      cameraService.getAllCameras().then((cameras) => {
        app.cameras = cameras
      })
      .catch((err) => {
        app.errors = err.message
      })
    }
  }

</script>
<style>
.camera-view {
    position: relative;
    text-align: center;
    color: white;
}

.camera-name {
    position: relative;
    top: 26px;    
}

.single-camera-button {
    position: relative;
    top: 26px;    
    right: 40px;
}
</style>
