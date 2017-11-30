<template>
    <div>
        <h3>Raspsonar</h3>
        <div class="card">
            {{ configuration.ID }}
        </div>
    </div>    
</template>
  
<script>
export default {
  props: ['configuration'],
  created: function () {}
}
</script>

<style>
</style>
