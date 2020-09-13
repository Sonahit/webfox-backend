import "fastify-jwt";
import "fastify-auth";
import "fastify-swagger";
import fastify, { FastifyInstance } from "fastify";
import { Response } from "common/responses/Response";

const server: FastifyInstance = fastify({
  logger: true,
  ajv: {
    customOptions: {
      allErrors: true,
    },
  },
});

server.addHook("onSend", (req, resp, payload: any, done) => {
  let jsonPayload;
  try {
    jsonPayload = JSON.parse(payload);
  } catch (e) {
    return done(null, payload);
  }
  if (jsonPayload.swagger) {
    return done(null, payload);
  }
  const response: Response = {
    success: Object.prototype.hasOwnProperty.call(jsonPayload, "success")
      ? jsonPayload.success
      : true,
    code: resp.statusCode,
  };

  if (jsonPayload.data) {
    response.data = jsonPayload.data;
  }

  if (jsonPayload.errors) {
    response.errors = jsonPayload.errors;
  }

  if (jsonPayload.message) {
    response.message = jsonPayload.message;
  }

  const newPayload = JSON.stringify(response);

  resp.header("Content-Type", "application/json");
  resp.header("Content-Length", newPayload.length);

  done(null, newPayload);
});

const port = (process.env.PORT && +process.env.PORT) || 3000;

async function boot() {
  // Global Middlewares
  await server.register(require("fastify-express"));
  await server.register(require("fastify-jwt"), {
    secret: "supersecret",
  });
  await server.register(require("fastify-auth"));
  await server.register(require("fastify-swagger"), {
    routePrefix: "/docs",
    swagger: {
      info: {
        title: "Api",
        version: "0.1.0",
      },
      externalDocs: {
        url: "https://swagger.io",
        description: "Find more info here",
      },
      host: "localhost",
      schemes: ["http"],
      consumes: ["application/json"],
      produces: ["application/json"],
      securityDefinitions: {
        http: {
          type: "bearer",
          name: "auth",
          in: "header",
        },
      },
    },
    exposeRoute: true,
  });
  server.use(require("cors")());

  // Register routes
  require("./routes")(server);

  server.listen(port, (err) => {
    if (err) {
      server.log.error(err);
      process.exit(1);
    }
    server.log.info(`server listening on ${server.server.address()}:${port}`);
  });

  server.setErrorHandler((err, req, resp) => {
    if (err.statusCode) {
      resp.statusCode = err.statusCode;
    }
    const payload: Partial<Response> = {
      success: false,
      errors: err.validation
        ? err.validation.reduce((acc, v) => {
            const param = [...new Set(Object.values(v.params))][0].toString();
            acc[param] = v.message;
            return acc;
          }, {} as Record<string, string>)
        : undefined,
      message: err.message,
    };
    resp.send(payload);
  });
}

boot();
