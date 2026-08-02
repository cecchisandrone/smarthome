<template>
  <div>
    <div class="header">
      <slot name="header">
        <h4 class="title">{{title}}</h4>
        <p class="category">{{subTitle}}</p>
      </slot>
    </div>
    <div class="content table-responsive table-full-width">
      <table class="table" :class="tableClass">
        <thead>
          <th v-for="column in columns" :key="column">{{column}}</th>
        </thead>
        <tbody>
          <tr v-for="(item, index) in data" :key="index">
            <!-- v-if used to win the iteration variable from v-for on the same
                 element; Vue 3 evaluates v-if first, so `column` would be
                 undefined. The two directives are split apart. -->
            <template v-for="column in columns" :key="column">
              <td v-if="hasValue(item, column)">{{itemValue(item, column)}}</td>
            </template>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
<script>
  export default {
    props: {
      columns: Array,
      data: Array,
      type: {
        type: String, // striped | hover
        default: 'Striped'
      },
      title: {
        type: String,
        default: ''
      },
      subTitle: {
        type: String,
        default: ''

      }
    },
    computed: {
      tableClass () {
        return `table-${this.type}`
      }
    },
    methods: {
      hasValue (item, column) {
        return item[column] !== 'undefined'
      },
      itemValue (item, column) {
        return item[column]
      }
    }
  }

</script>
<style>

</style>
