import { mkSchemasList } from '../utils/schemas'
// FIXME: Setup unit testing with electron
import { 
    habitatLocal,
} from '@hardocs-project/habitat-client'
import fs from 'fs'
// import { metadataExample } from '../../tests/fixtures/outputExamples'
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
    async selectStandard(){
        // TODO: check that the object has a set of properties...
        // TODO: Otherwise throw an error, is not a valid json schema
        console.log("Selecting standard")
        // const dir = await habitatLocal.chooseFolderForUse() 
        // commit('SET_STANDARD_DIR', dir)
        // Get the filename...
        // Open a file 
        // dialog.showOpenDialog({ properties: ['openFile'] })
        const baseStandard = await habitatLocal.selectContentFromFolder(['json'])
        console.log(baseStandard)
        // const baseStandard = readFile()
    },

    /**
     * The user might have a standard in a folder, or in the internet.
     * The regular approach is that the standard lives in the internet.
     * In this case the jsonSchema standard should be taken from a url.
     * We need to verify that is a jsonSchema.
     * This action involves setting the dir, but also storing the base standard in 
     * the store.
     */
    async setStandard({commit}){
        // TODO: check that the object has a set of properties...
        // TODO: Otherwise throw an error, is not a valid json schema
        
        const dir = await habitatLocal.chooseFolderForUse() 
        commit('SET_STANDARD_DIR', dir)
        // Get the filename...
        // Open a file 
        const baseStandard = readFile()
        console.log(baseStandard)
    
    },

    // selectStandardFile(){

    // },

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

    async updateMetadata({ commit }, metadata) {
        await commit('UPDATE_DATA_SET', metadata)
        
        // TODO: This should change to writeFile function 
        createNewHardocsJson(this.state.docs, metadata)
    },

    /**
     * When project is opened, then load the new metadata from hardocs.json
     */
    async loadsMetadata({commit}){
        let newMetadata = await JSON.parse(fs.readFileSync(`${this.state.docs.cwd}/.hardocs/hardocs.json`, 'utf8'))
        if(!newMetadata.metadata){
           newMetadata['metadata'] = {}
        }
        else newMetadata = newMetadata.metadata
        commit('UPDATE_DATA_SET', newMetadata)
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
const readFile = promisify(fs.readFile)

 
export async function writeMetadataFile(metadataFile, metadata){
    const writeFile = promisify(fs.writeFile)
    writeFile(metadataFile, metadata)
}


async function createNewHardocsJson(generalMetadata, metadataObject) {
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
