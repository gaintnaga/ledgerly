import swaggerJSDoc from "swagger-jsdoc";

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Ledgerly API",
      version: "1.0.0",
      description: "API documentation for Ledgerly",
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Development Server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },

  apis: [
    "./app/api/**/*.ts",
    "./app/api/**/route.ts",
  ],
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;
