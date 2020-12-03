/**
 * Example of output produced from creating a template from a schema
 */
const complexSchemaExample = {
  "project_name": "A project name goes here",
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
  }],
  "buffalo pets": [
    {
      "parent": "the boss",
      "kids": [
        {
          "name": "curly"
        }, {
          "name": "larry"
        }, {
          "name": "moe"
        }
      ]
    }
  ]
};

export const parsedComplexSchemaExample = complexSchemaExample;
