<template>
  <div v-if="!isSaved" :key="componentKey">
    <button class="primary-button" @click="saveDocFile()">Save</button>
  </div>
</template>
<script>
export default {
  name: 'SaveFile',
  props: {
    docId: Number,
    docIsSaved: Boolean
  },
  data() {
    return {
      componentKey: 1,
      dummy: {
        title: 'Name',
        description: 'akasdasd',
        path: 'docs/',
        content: 'this is a content',
        fileName: 'hello.md'
      }
    };
  },
  computed: {
    isSaved(){
      console.log("Print computed property in SaveFile " + this.$store.state.docs.currentDoc.saved)
      return this.$store.state.docs.currentDoc.saved
    }
  },
  methods: {
    saveDocFile() {
      this.componentKey += 1 
      this.$store.dispatch('saveDocFile');
      this.$store.dispatch('setSaved', true);
    },
    localDocIsSaved(){
      return this.$store.state.docs.currentDoc.saved
    }
  },
  watch:{
    '$store.state.docs.currentDoc.saved': function(){
      console.log("Whatching for save")
      this.localDocIsSaved()
    }
  }
};
</script>
