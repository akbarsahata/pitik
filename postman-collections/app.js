const express = require('express');
const app = express();
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./openapi/farming_openapi.json');

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.listen(8080, () => {
    console.log('server start listening at http://localhost:8080/api-docs');
});