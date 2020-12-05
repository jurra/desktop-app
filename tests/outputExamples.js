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
      { power: "100 watts" },
      { impression: "fast and furious" }
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
      fromTemplate: '|#fromTemplate#|',
      "kids": [
        {
          "name": "curly"
        }, {
          "name": "larry"
        }, {
          "name": "moe"
        },
        {
          fromTemplate: '|#fromTemplate#|'
        }
      ]
    }
  ],
  anObjectOnly: {
    name: "I'm an object only",
    description: 'see what I do with my flag',
    fromTemplate: '|#fromTemplate#|'
  }
};

export const parsedComplexSchemaExample = complexSchemaExample;
