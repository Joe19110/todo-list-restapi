const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Todo List API Documentation',
      version: '1.0.0',
      description: 'API documentation for Todo List application with Firebase Authentication and MySQL backend',
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Development server',
      },
    ],
    components: {
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              description: 'User ID (auto-generated)',
            },
            firebase_uid: {
              type: 'string',
              description: 'Firebase User ID',
            },
            name: {
              type: 'string',
              description: 'User name',
            },
            email: {
              type: 'string',
              description: 'User email',
            },
            birthdate: {
              type: 'string',
              format: 'date',
              description: 'User birthdate',
            },
            occupation: {
              type: 'string',
              description: 'User occupation',
            },
            profile_picture: {
              type: 'string',
              description: 'URL to profile picture',
            },
          },
        },
        Task: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              description: 'Task ID (auto-generated)',
            },
            text: {
              type: 'string',
              description: 'Task description',
            },
            completed: {
              type: 'boolean',
              description: 'Task completion status',
            },
            userId: {
              type: 'integer',
              description: 'ID of the user who owns this task',
            },
          },
        },
        Error: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              description: 'Error message',
            },
          },
        },
      },
    },
  },
  apis: ['./routes/*.js'], // Path to the API routes
};

const specs = swaggerJsdoc(options);
module.exports = specs; 