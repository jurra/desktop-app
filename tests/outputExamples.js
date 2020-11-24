/**
 * Example of output produced from creating a template from a schema
 */
const complexSchemaExample = {
    "project__name": "A project name goes here",
    "description": "Describe a wonderful project description",
    "components": [{
        "name": "A component name",
        "reference": "A reference",
        "specs": [
            "100 watts",
            "fast and furious"
        ]
    }],
    "contributors": [{
        "firstName": null,
        "lastName": null,
        "reference": null
    }]
}

export const parsedComplexSchemaExample = complexSchemaExample
