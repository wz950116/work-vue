<template>
  <qm-edit-tab ref='tab' :tab='Object.assign(tab, content)'></qm-edit-tab>
</template>

<script>
export default {
  data() {
    return {
      tab: {
        type: this.type,
        param: this.param,
        editForm: this.editForm,
        api: {},
        topBar: [],
        table: {
          showSummary: true,
          showSelection: false,
          cols: []
        }
      }
    }
  },
  props: {
    type: {
      type: String,
      default: 'view'
    },
    param: {
      type: [Object, String],
      default() {
        return {}
      }
    },
    editForm: {
      type: Object,
      default() {
        return {}
      }
    },
    content: {
      type: Object,
      default() {
        return {}
      }
    }
  }
}
</script>
