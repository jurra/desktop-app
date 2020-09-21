/**
 * A store for the projects aggregate level 
 * This aggregate level holds lists of projects
 * and displays basic metadata about projects
 */

 export const state = {
     devFeatures: process.env.devFeatures,
     projectList: [],
     currentProjectSummary: {}, // Here I can show some details about a selected project
     openedProject:{}
 }

 export const mutations = {
     FETCH_ALL(state, list){
        state.projectList = list
     },

     ADD_NEW_PROJECT(state, ){

     }
 }

 export const actions = {
     fetchAll({ commit }){
         // Do your actions here
         // TODO: Import Clives module
         // TODO: 
         let result = "This is a test for Divine";
         commit('FETCH_ALL', result);
        console.log(result)
     },
     addDummyProject(){
         // TODO: replicate basic push that clive is doing in hardocs-app-framework

     },
     addNewProject(){

     }
 }