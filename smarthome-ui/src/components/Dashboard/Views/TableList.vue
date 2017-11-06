<template>
    <div class="row">
      <div class="col-md-12">
        <div class="card">
          <paper-table :title="table1.title" :sub-title="table1.subTitle" :data="table1.data" :columns="table1.columns">

          </paper-table>
        </div>
      </div>     
    </div>
</template>
<script>
  import PaperTable from 'components/UIComponents/PaperTable.vue'
  import axios from 'axios'
  const tableColumns = ['Id', 'Title', 'Body']
  const tableData = []

  export default {
    components: {
      PaperTable
    },
    data () {
      return {
        table1: {
          title: 'Stripped Table',
          subTitle: 'Here is a subtitle for this table',
          columns: [...tableColumns],
          data: [...tableData]
        }
      }
    },
    created () {
      setTimeout(() => {
        axios.get(`https://jsonplaceholder.typicode.com/posts`).then(response => {
          this.table1.data = response.data
        }).catch(e => {
          this.errors.push(e)
        })
      }, 2000)
    }
  }

</script>
<style>

</style>
