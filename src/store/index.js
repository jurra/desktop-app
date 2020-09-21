import Vue from 'vue';
import Vuex from 'vuex';
import * as docs from '@/store/docs';
import * as projects from '@/store/projects';
import createPersistedState from 'vuex-persistedstate';


Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    docs,
    projects
  },
  plugins: [createPersistedState({
    storage: window.sessionStorage,
  })],
  state: {},
  mutations: {},
  actions: {}
});
