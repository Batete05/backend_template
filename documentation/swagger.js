const { required, number } = require("joi");

require("dotenv").config();

const annotations = {
  openapi: "3.0.0",
  info: {
    title: `Employee Management System`,
    version: "1.0.0",
    description: "Backend APIs for Employee Management  in a Given Company",
    contact: {
      name: "HRH",
      email: "bateteangenadette@gmail.com",
      url: "https://www.instagram.com/_b.a.t.e.t.e/",
    },
    social: {
      instagram: "https://www.instagram.com/_b.a.t.e.t.e/",
    },
  },
  servers: [
    {
      url: `http://localhost:${process.env.PORT || 3000}`,
    },
  ],
  tags: [
    { name: "Users" },
    { name: "Employees" },
    // { name: "Employees" },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
    schemas: {
      User: {
        type: "object",
        properties: {
          firstName: {
            type: "string",
            required: true,
            example: "ange nadette",
          },
          lastName: { type: "string", example: "nadette", required: "string" },
          email: {
            type: "string",
            required: true,
            example: "bateteangenadette@gmail.com",
          },
          phone: { type: "number", example: 245845785475, required: true },
          password: { type: "string", required: true },
        },
      },
      Employee: {
        type: "object",
        properties: {
          firtName: {
            type: "string",
            required: true,
            // example: "ange nadette",
            description: "the username of the User",
          },
          lastName: {
            type: "string",
            required: true,
            // example: "batete",
            description: "the name of the User",
          },
          email: {
            type: "string",
            required: true,
            // example: "bateteangenadette@gmail.com",
            description: "the email of the User",
          },
          phone: {
            type: "number",
            required: true,
            example: 787289178,
            description: "the phone number of the User",
          },
          nationalId: {
            type: "string",
            required: true,
            // example: "6789876678987678",
            description: "the national id of the User",
          },
          department: {
            type: "string",
            require: true,
            // example: "accountig",
            description: "the department of the user",
          },
          position: {
            type: "string",
            required: true,
            // example: "head office",
            description: "the position of the employee",
          },
          laptopManufacture: {
            type: "string",
            required: true,
            // example: "hp",
            description: "the laptop manufacture of the employee",
          },
          model: {
            type: "string",
            required: true,
            // example: "snn",
            description: "the model of the employee's laptop",
          },
          serialNumber: {
            type: "string",
            required: true,
            // example: "678987",
            description: "the serial number of the employee's laptop",
          },
        },
      },
    },
  },
  paths: {
    "/v1/auth/register": {
      post: {
        tags: ["Users"],
        summary: "Create a new user",
        description: "Endpoint to create a new user",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                $ref: "#/components/schemas/User",
              },
            },
          },
        },
        responses: {
          201: {
            description: "User created successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    token: {
                      type: "string",
                      description: "The Access Token of the created user",
                      example: "aajdcbirjebroeikhvnoirekvnerjkvnerjk",
                    },
                    message: {
                      type: "string",
                      description: "A success message",
                      example: "succes",
                    },
                  },
                },
              },
            },
          },
          400: {
            description: "Invalid request data",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                      description:
                        "The return message of unseccfull registration",
                      example: "That phone number/email is already in use.",
                    },
                  },
                },
              },
            },
          },
          500: {
            description: "Internal Server Error",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                      description:
                        "The return message of unseccfull registration",
                      example: "Internal server error",
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/v1/auth/login": {
      post: {
        tags: ["Users"],
        summary: "User login",
        description: "Endpoint for user login",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  email_phone: {
                    type: "string",
                    description: "The email address of the user",
                    example: "johndoe@example.com",
                  },
                  password: {
                    type: "string",
                    description: "The password for the user",
                    example: "p@ssw0rdHRH1",
                  },
                },
                required: ["email", "password"],
              },
            },
          },
        },
        responses: {
          201: {
            description: "Successful login",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    token: {
                      type: "string",
                      description: "Access token for the authenticated user",
                      example:
                        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEyMzQ1Njc4OTAiLCJlbWFpbCI6ImpvaG5kb2VAZXhhbXBsZS5jb20iLCJpYXQiOjE2MzAwMzM1MjV9.TsfxzxLHf9vGS8NMh4oHXht0O-vW9w3U5XvW7_VJ18M",
                    },
                    message: {
                      type: "string",
                      description: "Login success Employee",
                      example: "Successful login",
                    },
                  },
                },
              },
            },
          },
          400: {
            description: "Invalid request data",
          },
          401: {
            description: "Invalid email or password",
          },
          500: {
            description: "Internal Server Error",
          },
        },
      },
    },

    "/v1/employee/": {
      post: {
        tags: ["Employees"],
        description: "Add employees to our system",
        security: [
          {
            bearerAuth: [],
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                $ref: "#/components/schemas/Employee",
              },
            },
          },
        },
        responses: {
          201: {
            description: "Successful login",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                      description: "Employee added succesfully",
                      example: "Success Employee added",
                    },
                  },
                },
              },
            },
          },
          400: {
            description: "Invalid request data",
          },
          401: {
            description: "Invalid email or password",
          },
          500: {
            description: "Internal Server Error",
          },
        },
        get: {
          tags: ["Employees"],
          summary: "get all employees",
          security: [
            {
              bearerAuth: [],
            },
          ],
          description: "Get the employee information details.",
          responses: {
            200: {
              description: "OK",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/User",
                  },
                },
              },
            },
            404: {
              description: "User not found",
            },
            500: {
              description: "Internal Server Error",
            },
          },
        },
      },
    },
    "/v1/employee": {
      get: {
        tags: ["Employees"],
        summary: "Get all Employees",
        security: [
          {
            bearerAuth: [],
          },
        ],
        responses: {
          200: {
            description: "OK",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: {
                    $ref: "#/components/schemas/Employee",
                  },
                },
              },
            },
          },
          404: {
            description: "User not found",
          },
          500: {
            description: "Internal Server Error",
          },
        },
      },
      post: {
        tags: ["Employees"],
        summary: "Send new Employee",
        security: [
          {
            bearerAuth: [],
          },
        ],
        requestBody: {
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/Employee",
              },
            },
          },
        },
        responses: {
          201: {
            description: "Created",
          },
          400: {
            description: "Invalid request",
          },
          401: {
            description: "Invalid request data",
          },
          500: {
            description: "Internal Server Error",
          },
        },
      },
    },
    "/v1/api/Employee/{id}": {
      get: {
        tags: ["Employees"],
        summary: "Get a Employee by ID",
        security: [
          {
            bearerAuth: [],
          },
        ],
        parameters: [
          {
            name: "id",
            in: "path",
            description: "ID of the Employee",
            required: true,
            schema: {
              type: "string",
            },
          },
        ],
        responses: {
          200: {
            description: "OK",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Employee",
                },
              },
            },
          },
        },
      },
      put: {
        tags: ["Employees"],
        summary: "Update a Employee",
        security: [
          {
            bearerAuth: [],
          },
        ],
        parameters: [
          {
            name: "id",
            in: "path",
            description: "ID of the Employee",
            required: true,
            schema: {
              type: "string",
            },
          },
        ],
        requestBody: {
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/Employee",
              },
            },
          },
        },
        responses: {
          200: {
            description: "OK",
          },
        },
      },
      delete: {
        tags: ["Employees"],
        summary: "Delete a Employee by ID",
        security: [
          {
            bearerAuth: [],
          },
        ],
        parameters: [
          {
            name: "id",
            in: "path",
            description: "ID of the Employee",
            required: true,
            schema: {
              type: "string",
            },
          },
        ],
        responses: {
          200: {
            description: "OK",
          },
        },
      },
    },
    "/v1/api/emailVerification/{token}": {
      get: {
        tags: ["Email Verification"],
        summary: "a get method to verify the email",
        security: [
          {
            bearerAuth: [],
          },
        ],
        parameters: [
          {
            name: "token",
            in: "path",
            description: "token ",
            required: true,
            schema: {
              type: "string",
            },
          },
        ],
        responses: {
          200: {
            description: "OK",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    Verification: {
                      type: "string",
                      description: "approved verification",
                      example: "your email is verified you can now log in",
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/v1/api/emailVerification": {
      post: {
        tags: ["Email Verification"],
        summary: " a post method for email verification",
        security: [
          {
            bearerAuth: [],
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  tokenString: {
                    type: "string",
                    description: "add the code recieved on email",
                    example: "johndoe@example.com",
                  },
                },
                required: ["tokenString"],
              },
            },
          },
        },
        responses: {
          200: {
            description: "Your email is now verified now u can  login",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    token: {
                      type: "string",
                      description: "approval Employee",
                      example: "your account is now verified",
                    },
                  },
                },
              },
            },
          },
          400: {
            description: "Invalid request",
          },
          401: {
            description: "Invalid token",
          },
          500: {
            description: "Internal Server Error",
          },
        },
      },
    },
  },
};

module.exports = { annotations };
