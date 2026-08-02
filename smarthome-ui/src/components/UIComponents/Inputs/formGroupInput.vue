<template>
  <div class="form-group">
    <label v-if="label">
      {{label}}
    </label>
    <input class="form-control border-input" v-bind="inputProps" :value="modelValue"
           @input="onInput">
  </div>
</template>
<script>
  /**
   * Vue 3 renamed the component v-model contract: the `value` prop and `input`
   * event became `modelValue` and `update:modelValue`. Doing the rename here
   * keeps all ~50 `<fg-input v-model="...">` call sites untouched.
   */
  export default {
    props: {
      type: {
        type: String,
        default: 'text'
      },
      label: String,
      name: String,
      disabled: Boolean,
      placeholder: String,
      modelValue: [String, Number],
      // v-model modifiers are handed to the component in Vue 3; see onInput.
      modelModifiers: {
        type: Object,
        default: () => ({})
      },
      step: String
    },
    emits: ['update:modelValue'],
    computed: {
      /**
       * The old template forwarded every prop to the <input> with
       * v-bind="$props". modelValue and modelModifiers are v-model plumbing
       * rather than attributes, so they are held back; modelValue is bound as
       * :value separately, exactly as before.
       */
      inputProps () {
        const {modelValue, modelModifiers, ...attrs} = this.$props
        return attrs
      }
    },
    methods: {
      /**
       * Vue 2 applied .number and .trim itself, including for component
       * v-model. Vue 3 only forwards them as modelModifiers and leaves the
       * cast to the component - without this, every `v-model.number` in
       * Configuration/* would start sending strings to the API.
       *
       * The parseFloat-or-keep-the-string fallback mirrors Vue 2's toNumber().
       */
      onInput (event) {
        let value = event.target.value
        if (this.modelModifiers.trim) {
          value = value.trim()
        }
        if (this.modelModifiers.number) {
          const parsed = parseFloat(value)
          value = isNaN(parsed) ? value : parsed
        }
        this.$emit('update:modelValue', value)
      }
    }
  }

</script>
<style>

</style>
