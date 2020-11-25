<template>
  <div>
    <button class="primary-button" @click="saveFile()">Save</button>
  </div>
</template>
<script>
export default {
  name: 'SaveFile',
  
  computed: {
    saved() {
      return this.$store.state.docs.currentDoc.saved
    },
  },
  methods: {
    saveFile() {
        this.$store.dispatch('saveMetadata')
      }  
  }
}
</script>
