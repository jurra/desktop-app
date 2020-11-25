import fs, { readFile } from 'fs'
import { createLocalVue } from '@vue/test-utils'
// import { habitatLocal } from '@hardocs-project/habitat-client';

import Vuex from 'vuex'
import { cloneDeep } from 'lodash'
import { state, getters, actions, mutations, writeMetadataFile } from '../src/store/metadata'
import { promisify } from 'util' 



// Service used in actions
import {
    buildsTemplate,
    mkSchemasList,
    extractProps
} from '../src/utils/schemas'
import { metadataExample } from './fixtures/outputExamples.js'


const absoluteSchemaDir = "D:\\my-projects\\hardocs\\REPOS\\hardocs-vue-client\\tests\\fixtures\\sample-schemas\\"
const schemaDir = './tests/fixtures/sample-schemas/'
const selectedSchemaFile = 'project.schema.json'
const schemasList = {
    complex: 'complex_schema.json'
}
const schemasRef = [
    { title: 'The root schema', ref: 'person.json' },
    { title: 'Project', ref: 'project.schema.json' },
    { title: 'Vendor', ref: 'vendor.schema.json' }
]



/**
 * A json schemas loader, template generator and editor in vue that
 * allows user to generate metadata easily and consistently with schemas specs
 * When user selects a set of schemas, the component loads a root schema
 * that has all the reference to child schemas to generate metadata
 * additional semi-structured that can be added to the schemas
 */
describe("Json schemas loader and templates based on schemas", () => {
    describe("The utility library layer", () => {
        it("Extract props with additional items",() => {
            // console.log(metadataExample)
            extractProps(schemasList.complex)
        })

        it("Generates lists available schemas in a path", async () => {
            let schemasList = await mkSchemasList(absoluteSchemaDir)
            // await console.log("Loading schemasdir " + JSON.stringify(mkSchemasList(absoluteSchemaDir, selectedSchemaFile)))

            expect(schemasList.refSchemas).toEqual(schemasRef)
            // expect(schemasList.folderPath).toEqual(undefined) // FIXME: this should be passed from the state
        })

        it("converts json schema into a template that is a json object", () => {
            let json = buildsTemplate(schemaDir, schemasList.complex)
            json = json.fields
            let mockObject = JSON.stringify({
                "$schema": '',
                context: {
                    title: "Part",
                },
                path: '',
                name: '',
                shortTitle: '',
                docsDir: '',
                entryFile: '',
                vendors: ''
            })
            mockObject = JSON.parse(mockObject)
            let jsonKeys = Object.keys(json).sort()
            let mockObjectKeys = Object.keys(mockObject).sort()
            console.log(jsonKeys)
            expect(jsonKeys).toStrictEqual(mockObjectKeys)
        })       
    })

    describe("The vuex state management layer", () => {
        const localVue = createLocalVue()
        localVue.use(Vuex)

        const store = new Vuex.Store({
            modules: {
                metadata: {
                    state,
                    actions,
                    mutations,
                    getters
                }
            }
        })

        it("Creates a file in the expected path if it doesn't exist", async () => {

        })

        it.only("Writes the metadata file to the projects folder", async () => {
            // This one only works if the file exists
            const filePath = "./tests/fixtures/destroy/metadata.json"
            const readFile = promisify(fs.readFile)
            const removeFile = promisify(fs.unlink)
            
            await writeMetadataFile(filePath, JSON.stringify(metadataExample, null, 2))
            let createdMetadataFile = await readFile(filePath, 'utf8')
            expect(createdMetadataFile).toEqual(JSON.stringify(metadataExample, null, 2))
            removeFile(filePath)
        })    

        it("Loads the data from the metadata file into the metadata store", () =>{
            /**
             * Make sure that the metadata file content is the same as
             * the metadata in the store
             */
            

        })

        it("Sets the standard correctly when the user selects the standard", () => {
            /**
             * Compare title of the standard 
             * This should happen when the user creates a new project,
             * 
             */

             // Read the file of the standard directly
             // Compare standard in the state with the above
        })

        it("Saves the metadata properly", () => {
            /**
             * Select  
             */
        })

        it("stores the list of schemas in the state given a folder path", async () => {
            // store.commit('SET_SCHEMAS_DIR', schemaDir)
            // let list = await mkSchemasList(store.state.metadata.schemaDir)
            // store.dispatch('addSchemas', list)
            // expect(store.state.metadata.schemasRef).toStrictEqual(schemasRef)
        })


        it("Creates a new object in the store based on a selected json schema", () => {
            // let key = "$schema"
            // store.dispatch('addObject', { schemaDir: schemaDir, selectedSchemaFile: selectedSchemaFile })
            // // console.log(JSON.stringify(store.state.metadata, null, 2))
            // expect(store.state.metadata.dataSet[0].hasOwnProperty(key)).toBe(true)
        })


        /**
         * Tip for the user on schema details, and examples of values
         */

    })
})








// FIXME: this might be irrelevant
// it("Updates json object based ", () => {

// })

// it("Validates objects metadata against the schema when action is dispatched", () => {
//     // Action dispatching mutation
// })

/**
 * Pushes data to the database...
 *
 */

/**
 * Creates in the frontend a new data object
 *
 */

/**
 * Injects linked data into html documents, more flat searches
 *
 *
 *
 */
