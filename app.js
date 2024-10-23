const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const bodyParser = require('body-parser');
const cors = require('cors');

// Kết nối tới Express
const app = express();

// Middleware tự định nghĩa để thiết lập giới hạn kích thước payload response
const limitResponseSize = (req, res, next) => {
  const limit = '500mb'; // 500MB
  res.setHeader('Content-Length', limit);
  res.setHeader('Access-Control-Allow-Origin', '*');
  next();
}

// Sử dụng middleware limitResponseSize cho tất cả các yêu cầu
app.use(limitResponseSize); 
app.use(bodyParser.json());
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  next();
});
app.use(cors({ origin: '*' }));

// Sử dụng Swagger 
const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Spam Data Backend API Documentation',
    version: '1.0',
    description: 'Node.js API Documentation',
  },
  servers: [
    {
      url: 'http://localhost',
    },
  ],
};
const options = {
  swaggerDefinition,
  apis: ['./routes/*.js'], // Path to the API docs
};
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerJsdoc(options)));

  
  // Sử dụng routes
require("./startup/routes")(app);
  
module.exports = app;
