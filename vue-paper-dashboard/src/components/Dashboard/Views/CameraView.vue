<template>
  <div>
    <img class="img-responsive img-thumbnail" alt="Camera image" onerror="this.src='static/img/not_available.jpg'" :src="imageSrc" />
  </div>
</template>
<script>
  export default {
    data: function () {
      return {
        imageSrc: 'static/img/loading_icon.gif'
      }
    },
    props: ['camera'],
    mounted () {
      var img, that
      img = new Image()
      that = this
      img.onload = function () {
        that.imageSrc = that.camera.Url
      }
      img.src = this.camera.Url
      if (this.camera.Type === 'sv3c') {
        setInterval(this.updateSv3cUrl, 10000)
      }
      if (this.camera.Type === 'microcam') {
        setInterval(this.updateMicrocamUrl, 10000)
      }
    },
    beforeDestroy () {
      this.imageSrc = '#'
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
