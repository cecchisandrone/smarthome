<template>
  <modal v-if="visible" @close="cancel">
    <template #header>
      <h3 class="confirm-dialog-title">
        <i v-if="icon" :class="icon"></i> {{ title }}
      </h3>
    </template>
    <template #body>
      <p class="confirm-dialog-message">{{ message }}</p>
    </template>
    <template #footer>
      <button class="btn btn-danger confirm-dialog-confirm" v-on:click="confirm">
        {{ confirmText }}
      </button>
      <button class="btn btn-default confirm-dialog-cancel" v-on:click="cancel">
        {{ cancelText }}
      </button>
    </template>
  </modal>
</template>

<script>
  import Modal from './Modal.vue'

  const ICONS = {
    warning: 'ti-alert',
    danger: 'ti-close',
    info: 'ti-info',
    success: 'ti-check'
  }

  /**
   * Replaces vue2-simplert, which is Vue 2 only and unmaintained.
   *
   * The imperative open(options) API is kept deliberately: it matches the
   * openSimplert(obj) call sites it replaces, so swapping it in is a rename
   * rather than a rewrite of every delete handler.
   */
  export default {
    name: 'confirm-dialog',
    components: { Modal },
    data () {
      return {
        visible: false,
        title: '',
        message: '',
        type: 'warning',
        confirmText: 'Confirm',
        cancelText: 'Cancel',
        onConfirm: null,
        onCancel: null
      }
    },
    computed: {
      icon () {
        return ICONS[this.type] || ''
      }
    },
    methods: {
      open (options) {
        const opts = options || {}
        this.title = opts.title || ''
        this.message = opts.message || ''
        this.type = opts.type || 'warning'
        this.confirmText = opts.confirmText || 'Confirm'
        this.cancelText = opts.cancelText || 'Cancel'
        this.onConfirm = opts.onConfirm || null
        this.onCancel = opts.onCancel || null
        this.visible = true
      },
      confirm () {
        // Close before running the callback, mirroring simplert: the callback
        // usually triggers a reload of the list behind the dialog.
        this.visible = false
        if (this.onConfirm) this.onConfirm()
      },
      cancel () {
        this.visible = false
        if (this.onCancel) this.onCancel()
      }
    }
  }
</script>

<style>
  .confirm-dialog-title {
    margin-top: 0;
  }

  .confirm-dialog-confirm {
    margin-right: 10px;
  }
</style>
