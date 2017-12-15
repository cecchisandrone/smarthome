<template>
  <div>
    <img class="img-responsive img-thumbnail" alt="Camera image" onerror="this.src='static/img/not_available.jpg'" :src="camera.Url" />
  </div>
</template>
<script>
  export default {
    props: ['camera'],
    created () {
      if (this.camera.Type === 'sv3c') {
        setInterval(this.updateUrl, 1000)
      }
    },
    methods: {
      updateUrl: function () {
        this.camera.Url = this.camera.Url.split('?')[0] + '?' + Date.now()
      }
    }
  }
</script>
