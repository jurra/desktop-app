<template>
  <div class="">
    <div class="editor">
      <div class="editable"></div>
    </div>
    <div
      id="app"
      class="content-center w-full m-auto items-center flex-col"
    >
      <div class="">
        <p class="pl-4"><strong>Project folder :  </strong>{{docs.cwd}}</p>

        <JsonEditor
          :options="{
            confirmText: 'confirm',
            cancelText: 'cancel'
          }"
          :objData="data"
          :v-model="data"
          :templatesData="{
        selections: [
          'No Template',
          'Template a',
          'Template b',
          'Template c',
        ],
        template: null,
        store: this.$store,
      }"
          v-on:input="passDataFromEditor"
        ></JsonEditor>
      </div>
    </div>
  </div>
</template>

<script>
// import Vue from 'vue';
// import DocEditor from '@/components/DocEditor';
// import DocsServices from '@/services/index';
// import SchemasDir from '@/components/MetadataEdit__SchemasDir';
import { mapGetters, mapState } from 'vuex';

export default {
  //   name:"JsonEditor",
  components: {},
  created () {
    this.$root.$on('template-selected', (event) => { this.showEvent(event) })
  },
  data: function() {
    return {
      path: '',
      query: '',
      componentKey: 1,
      // json:this.getsJsonFromStore
    };
  },
  computed: {
    ...mapGetters({
      jsonData: 'stateData'
    }),
    ...mapState({
      docs: state => state.docs,
      dataSet: state => state.metadata.dataSet
    }),
    data: {
      get: function() {
        console.log("getting this data set " + JSON.stringify(this.dataSet, null, 2))
        // JSON.stringify("MetadataPanel gets" + this.dataSet); // BUG: For some reason this impacts reactiveness
        return this.dataSet;
      },
      set: function(newJsonData) {
        console.log("Setting : " + JSON.stringify(newJsonData, null, 2))
        return this.$store.commit('UPDATE_DATA_SET', newJsonData);
      }
    },
    schemas() {
      return this.$store.state.metadata.schemasRef;
    }
  },
  methods: {
    showEvent: function(event) {
      console.log('showEvent: ' + JSON.stringify(event))
      // this.templatesData.template
      const templateData = {
        name: event,
        data: [
          { name: 'wut', type: 'number', childParams: null, remark: 3 },
          { name: 'quantity', type: 'string', childParams: null, remark: 'remarkable' },
          // { quantity: 0 },
          // { specifications: 'here a spec - longer?' }
        ]
      }

      console.log ('new jsonData: ' + JSON.stringify(this.jsonData))
      this.$root.$emit('template-returned', templateData)
    },

      // Listen to child emitted event to update the state based on new input
    async passDataFromEditor(input) {
      return this.$store.dispatch('updateDataset', input)
    }
  }
};
</script>
<style scoped>
.page * {
  @apply mb-2;
}

.cell {
  @apply mb-2;
}

body {
  font-size: 14px;
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

.clearfix {
  *zoom: 1;
}

.clearfix:before,
.clearfix:after {
  content: '';
  display: table;
}

.clearfix:after {
  clear: both;
}

.t {
  text-align: center;
  margin-top: 40px;
  margin-bottom: 60px;
}

.editor-w {
  margin: 0 auto;
  max-width: 1200px;
  padding: 0 20px;
}

.w-2 {
  float: left;
  width: 50%;
}

.editor {
  padding: 20px 60px;
}
</style>
