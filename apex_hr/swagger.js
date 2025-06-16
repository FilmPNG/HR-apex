// swagger.js
const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'My API Documentation',
      version: '1.0.0',
      description: 'เอกสาร API สำหรับระบบข่าว',
    },
    servers: [
      {
        url: 'http://localhost:5000',
      },
    ],
  },
  apis: ['./routes/*.js'], // <<< ใส่ path ไปยังไฟล์ route ที่มีคอมเมนต์ Swagger
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;