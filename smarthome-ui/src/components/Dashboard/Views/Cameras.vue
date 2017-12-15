<template>
  <div>
    <div v-for="(camera, index) in cameras">
      <div class="col-md-4" v-if="camera.Enabled && (singleCamera == null || index == singleCamera)">
        <div class="camera-view">
          <div class="camera-name">{{camera.Name}}</div>
          <camera-view :camera="camera"></camera-view>
          <button v-if="singleCamera != null" class="btn btn-sm" v-on:click="toggleSingleCamera(null)">
            Show all cameras
          </button>
          <button v-if="singleCamera == null" class="btn btn-sm" v-on:click="toggleSingleCamera(index)">
            Show only this camera
          </button>
        </div>
      </div>
    </div>
  </div>  
</template>

<script>
  import Simplert from 'vue2-simplert'
  import * as cameraService from 'src/services/cameraService.js'
  import CameraView from 'components/Dashboard/Views/CameraView.vue'

  export default {
    components: {
      Simplert,
      CameraView
    },
    data () {
      return {
        cameras: {},
        singleCamera: null
      }
    },
    methods: {
      toggleSingleCamera: function (index) {
        this.singleCamera = index
        if (index != null) {
          this.invalidateImgTags(index)
        }
      },
      invalidateImgTags: function (index) {
        // for (var i = 0; i < cameras.length; i++) {
        //   this.$el.children[i].setAttribute('src', '#')
        // }
      }
    },
    beforeDestroy () {
      this.invalidateImgTags(null)
    },
    created () {
      this.singleCamera = null
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
