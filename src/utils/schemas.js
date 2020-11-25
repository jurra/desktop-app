import fs from 'fs'
import path from 'path'

/**
 * Extract properties recursively
 *  
 *  
 */
export function extractProps(schema) {
    let result = {}
    // Pointer to current reference in the result object

    // let referenceKey
    
    /**
     * We need to parameters here
     * A schema, and a pointer to the place where we wan to push the result
     * 
     */ 
    function mainOperation(schema, refNode){
        /**
         * Exception handling
         * How do we deal with anonymous objects...
         * What happens if the reference node is an array ??
         */
        if ('properties' in schema) {
            let props = schema.properties
            for (let prop in props) {
                const propObject = props[prop]
    
                // Check that the result object doesnt have the property
                // If refNode is an object do this
                // if(typeof propObject.default === 'object'){
                //     console.log("type is an object")
                    refNode[prop] = propObject.default
                // }
                // else if(typeof propObject.default === 'array'){
                //     console.log("type is an array")
                //     // refNode.push(props[prop])
                // }


                // Else if refNode is an array, do something else...
                
                // console.log("Reference Node with or without name: " + JSON.stringify(refNode))
                
                
                if(propObject.additionalItems){
                    // In this body we want to push inside the property
                    console.log("Reference Node array " + JSON.stringify(refNode))


                    // refNode = refNode[prop]
                    console.log("Property has additional Items")
                    // Recursion to extract nested schemas
                    // extractProps(propObject.items.anyOf[0]) // For the sake of simplicity we will get only the first item
                    mainOperation(propObject.items.anyOf[0], refNode)

                }
            }
        }
    }
    mainOperation(schema, result)
    console.log("Log the template result: " + JSON.stringify(result, null, 2))
}

// export function processProp(propName, propObject){
//     // console.log(prop)
//     return { processedProp: propName : propObject.default, additionalItems: propObject.additionalItems  }
// }


/**
 * Preconditions: currently all schemas are in a dir as a context...
 * Builds a template object that includes fields, examples and references to
 *  other schemas
 * Reference to other schemas are used to compose complex schemas
 * @param { String } schemaDir a path where the schemas a re located
 * @param { String } schemaFileName the schemaFile name
 */
export function buildsTemplate(schemaDir, schemaFileName) {
    // Check if it is an invalid schema

    // Find the location of the schema in the file system
    let schema = fs.readFileSync(`${schemaDir}${schemaFileName}`, 'utf8')
    schema = JSON.parse(schema)

    // Create response object
    const object = {
        referenceSchemas: [], // an array of objects
        fields: schema.properties,
        examples: []
    }

    extractProps(schema)

    // Recursion on properties
    // If additionalItems == true then go a level down
    // Go into items{..}   then to anyOf[..] then get the properties
    // Push the properties into a new child object

    // if ('properties' in schema) {
    //     let props = schema.properties
    //     for (let key in props) {

    //         // Find properties that are complex
    //         if (!('type' in props[key])) {

    //             // find $ref schemas and list them
    //             let complexSchema = props[key]
    //             for (let key in complexSchema) {
    //                 if ('$ref' in complexSchema[key]) {
    //                     if (Object.values(complexSchema[key])[0]) {
    //                         const reference = Object.values(complexSchema[key])[0]
    //                         let referenceTitle = fs.readFileSync(`${schemaDir}${reference}`, 'utf8')
    //                         referenceTitle = JSON.parse(referenceTitle)
    //                         object.referenceSchemas.push({ '$ref': reference, type: referenceTitle.title })
    //                     }
    //                 }
    //             }
    //         }

    //         // empty values in the template
    //         object.fields[key] = ""
    //     }
    // }

    // object.fields['$schema'] = `./${schemaFileName}`

    return object
}

/**
 * Creates a list of objects that defines the title of the schema
 * and the name as of the file that contains the schema as a reference
 * @param {String} folderPath
 */
export function mkSchemasList(folderPath) {
    return new Promise((resolve, reject) => {
        // servicesLog('loadFilePathsFromFolder: ' + JSON.stringify(folderPath))
        console.log(folderPath)
        try {
            let files = fs.readdirSync(folderPath) //FIXME: Exception, a directory lives inside this path...
            let refSchemas = []
            // FIXME: make it a reduce function
            files.forEach((file) => {
                let schema = fs.readFileSync(path.join(folderPath, file), 'utf8')
                if (JSON.parse(schema).title) {
                    refSchemas.push({
                        title: JSON.parse(schema).title,
                        ref: file
                    })
                }
            })
            resolve({
                folderPath: folderPath,
                refSchemas: refSchemas
            })
        } catch (e) {
            console.log(JSON.stringify({ loadSchemas: 'error: ' + e.toString() }))
            reject({ loadSchemas: 'error: ' + e.toString() })
        }
    })
}









