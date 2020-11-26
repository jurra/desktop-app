import path from 'path'
import { mkSchemasList } from '../utils/schemas'
// FIXME: Setup unit testing with electron
import { 
    habitatLocal,
} from '@hardocs-project/habitat-client'
import fs from 'fs'
import { metadataExample } from '../../tests/fixtures/outputExamples'
import { promisify } from 'util' 
// import Ajv from 'ajv';
// let docs = context.rootState.instance.docs


export const state = {
    standardCwd:"",
    isSaved: true,
    savedVersion:{},
    metadataPath:"",
    metadataFilename:"", // This comes from create a project
    schemasDir: "",      // here goes a path
    schemasRef: [],
    hardocsJson: {},     // this is wrong
    dataSet:{},
    metadata: {},
    
    /**
     * CONSIDERATION: What happens when the baseStandard changes,
     * Ideally the user could change the base standard, the user should be notified, with the notion 
     * that standard might need to change, alternatively we could cache a log of metadata files and 
     * the correspondent standard...
     */
    baseStandard:{}      // This is where the current baseStandard is defined
}

export const mutations = {
    SET_STANDARD_DIR(state, dir){
        state.standardCwd = dir
    },

    SET_BASE_STANDARD(state, jsonSchema){
        state.baseStandard = jsonSchema
    },

    SET_SAVED_METADATA(state, isSaved){
        state.isSaved = isSaved
    },

    ADD_OBJECT(state, payload) {
        state.metadata.push(payload)
    },

    ADD_ROOT_SCHEMAS(state, schemasList) {
        state.schemasRef = schemasList
    },
    
    SET_SCHEMAS_DIR(state, path) {
        state.schemasDir = path
    },

    UPDATE_DATA_SET(state, metadataObject) {
        state.metadata = metadataObject
    },

    SET_HARDOCS_JSON(state, object) {
        state.hardocsJson = object
    },
    
}

export const actions = {
    /**
     * The user might have a standard in a folder, or in the internet.
     * The regular approach is that the standard lives in the internet.
     * In this case the jsonSchema standard should be taken from a url.
     * We need to verify that is a jsonSchema.
     * This action involves setting the dir, but also storing the base standard in 
     * the store.
     */

    async selectStandard({commit}){
        // TODO: check that the object has a set of properties...
        // TODO: Otherwise throw an error, is not a valid json schema
        console.log("Selecting standard")
        const baseStandard = await habitatLocal.selectContentFromFolder(['json'])
        let baseStandardPath = baseStandard.filePath
        baseStandardPath = path.dirname(baseStandardPath)
        commit('SET_STANDARD_DIR', baseStandardPath)
        commit('SET_BASE_STANDARD', JSON.parse(baseStandard.content))
    },

    /**
     * We add a schema dir to provide the contexts of schemas relevant for this
     * hardocs projects, we could for instance compile a collection of standards
     * within a folder, and then take it from there
     */
    async setSchemasDir({ commit, dispatch }) {
        const dir = habitatLocal.chooseFolderForUse() //BUGFIX: Shouldnt this consume a path string???
        await commit('SET_SCHEMAS_DIR', dir)
        const schemasRefs = await mkSchemasList(dir)
        dispatch('addSchemas', schemasRefs)
    },

    /**
     * @param {Array} schemasList contains a list of objects with reference schemas
     */
    addSchemas({ commit }, schemasList) {
        console.log(schemasList)
        const { refSchemas } = schemasList
        commit('ADD_ROOT_SCHEMAS', refSchemas)
    },

    /**
     *
     * @param {Object} payload {schemaDir: "", selectedSchemaFile: ""}
     */
    addObject({ commit }, dataObject) {
        commit('ADD_OBJECT', dataObject)
    },

    async updateMetadata({ commit, dispatch }, metadata) {
        console.log("Updating metadata")
        // if(metadata){
            await commit('UPDATE_DATA_SET', metadata)
            // TODO: This should change to writeFile function 
            dispatch('saveMetadata')
        // }
        // else {
        //     dispatch('loadsMetadata')
        // }
    },

    /**
     * When project is opened, then load the new metadata from hardocs.json
     */
    async loadsMetadata({commit, dispatch}){
        let newMetadata
        if(fs.existsSync(`${this.state.docs.cwd}/.hardocs/metadata.json`)){
             newMetadata = await JSON.parse(fs.readFileSync(`${this.state.docs.cwd}/.hardocs/metadata.json`, 'utf8'))
             commit('UPDATE_DATA_SET', newMetadata)
        }
        else {
            commit('UPDATE_DATA_SET', metadataExample)
            dispatch('saveMetadata')
            dispatch('loadsMetadata')
        }
    },

    async saveMetadata({state, commit}){
        commit('SET_SAVED_METADATA', true) // This will not be used during this first prototype
        const fileContent = JSON.stringify(state.metadata, null, 2)
        
        // FIXME: this is now hardcoded but it should be configurable 
        writeMetadataFile(`${this.state.docs.cwd}/.hardocs/metadata.json`, fileContent )
    }
    
}

export const getters = {
    stateData: state => {
        return state //FIXME: This is wrong
    }
}



/** HELPER FUNCTIONS FOR METADATA STATE STORE */
/**
 * Why this helper functions? and why they live here?
 * 
 * These helper functions cannot be actions, because actions are very strict,
 * they require always two parameters, and the first one always need to be
 * a parameter like {commit} or { dispatch}, otherwise it wont work
 * Also in order to pass several parameters in the second parameter of the action
 * it needs to be passed as an object
 */


/** TODO: This might live in utils Promisified file system operations */
// const readFile = promisify(fs.readFile)

 
export async function writeMetadataFile(metadataFile, metadata){
    const writeFile = promisify(fs.writeFile)
    writeFile(metadataFile, metadata)
}


export async function createNewHardocsJson(generalMetadata, metadataObject) {
    // FIXME: We should do json schema validation here
    if(Object.prototype.hasOwnProperty.call(generalMetadata, 'docsDir')){
        let newMetadataFile = {
            path: generalMetadata.cwd,
            entryFile: generalMetadata.entryFile,
            docsDir: generalMetadata.docsFolder,
            metadata: metadataObject
        }

        newMetadataFile = await JSON.stringify(newMetadataFile, null, 2)
        // console.log("New metadata to store in json: " + newMetadataFile)

        fs.writeFileSync(`${generalMetadata.cwd}/.hardocs/hardocs.json`, newMetadataFile, function (err) {
            if (err) return console.log(err)
            console.log(newMetadataFile)
        });
    }
    else {
        console.log("Cant generate hardocsJson from invalid hardocs project")
    }

}
