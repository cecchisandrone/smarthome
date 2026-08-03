<template>
  <div>
    <iframe v-if="camera.Type === 'iframe'" frameborder="no" scrolling="no" allowfullscreen="true" width="100%" height="480" :src="camera.Url"></iframe>
    <img v-if="camera.Type !== 'iframe'" class="img-responsive img-thumbnail" alt="Camera image" onerror="this.src='static/img/not_available.jpg'" :src="imageSrc" />
  </div>
</template>
<script>
  export default {
    data: function () {
      return {
        imageSrc: 'static/img/loading_icon.gif',
        refreshTimer: null
      }
    },
    props: ['camera'],
    mounted () {
      if (this.camera.Type === 'iframe') {
        this.imageSrc = '#'
      } else {
        const that = this
        const img = new Image()
        img.onload = function () {
          that.imageSrc = that.camera.Url
        }
        img.src = this.camera.Url
        if (this.camera.Type === 'sv3c') {
          this.refreshTimer = setInterval(this.updateSv3cUrl, 5000)
        }
        if (this.camera.Type === 'microcam') {
          this.refreshTimer = setInterval(this.updateMicrocamUrl, 5000)
        }
      }
    },
    /**
     * Vue 3 renamed beforeDestroy to beforeUnmount, so this hook had been
     * silently dead since the flip. The interval it now also clears was never
     * cleared at all: leaving the cameras page left it polling the camera
     * forever, once per mounted camera.
     */
    beforeUnmount () {
      this.imageSrc = '#'
      if (this.refreshTimer) {
        clearInterval(this.refreshTimer)
        this.refreshTimer = null
      }
    },
    methods: {
      updateSv3cUrl: function () {
        this.imageSrc = this.camera.Url.split('?')[0] + '?' + Date.now()
      },
      updateMicrocamUrl: function () {
        this.imageSrc = this.camera.Url + '&param=' + Date.now()
      }
    }
  }
</script>
