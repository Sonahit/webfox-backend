import "fastify-auth";
import "fastify-jwt";
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { RouteOptions } from "fastify/types/route";
import { User } from "entities/User";
import { BadRequestException } from "common/exceptions/BadRequestException";
import { TokenResponse } from "common/responses/TokenResponse";
import { UserSession } from "common/types/UserSession";
import users from "database/mem";
import { jwtHelper } from "common/helpers/JwtHelper";

// DEMO-DATA
// DO NOT USE THIS ON PRODUCTION
const getUser = (login: string, password: string): User => {
  const user = users.find((u) => u.login === login);
  if (user && user.password === password) {
    return user;
  }
  throw new BadRequestException("User not found");
};

type LoginRequest = {
  login: string;
  password: string;
};

export = (
  server: FastifyInstance,
  parentUrl: string = ""
): RouteOptions | RouteOptions[] => {
  return {
    url: `${parentUrl}/login`,
    method: "POST",
    onSend: (req, res, payload, done) => {
      const resp = JSON.parse(payload as string) as TokenResponse;
      if (!resp?.data?.token) {
        return done(null, payload);
      }
      const jwt = server.jwt.decode(resp.data.token) as UserSession;
      jwtHelper.writeJwt(resp.data.token, jwt);

      done(null, payload);
    },
    handler: async (
      request: FastifyRequest,
      resp: FastifyReply
    ): Promise<TokenResponse> => {
      const body = (request.body || {}) as LoginRequest;
      const user = getUser(body.login, body.password);
      if (!user) {
        throw new BadRequestException();
      }
      const { login } = user;

      const payload: UserSession = {
        login,
        timestamp: +(Date.now() / 1000).toFixed(0),
      };

      const token = server.jwt.sign(payload, {});
      return {
        data: {
          type: "Bearer",
          token,
        },
      };
    },
    schema: {
      body: {
        type: "object",
        required: ["login", "password"],
        properties: {
          login: {
            type: "string",
          },
          password: {
            type: "string",
          },
        },
      },
      response: {
        "2xx": {
          data: {
            type: "object",
            properties: {
              type: {
                type: "string",
                enum: ["Bearer", "Basic"],
              },
              token: {
                type: "string",
              },
            },
          },
        },
      },
    },
  };
};
