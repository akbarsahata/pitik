const collection = require('../collections/farming.json'); // any Postman collection JSON file
const { transpile } = require('postman2openapi');
const fs = require('fs')

// Returns a JavaScript object representation of the OpenAPI definition.
const openapi = transpile(collection);

openapi.servers = [
    {
        url: "https://api.pitik.dev/v1"
    },
    {
        url : "https://api.pitik.id/v1"
    }
];

fs.writeFileSync('./openapi/farming_openapi.json', JSON.stringify(openapi, null, 2));