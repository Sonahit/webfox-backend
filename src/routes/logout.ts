import "fastify-auth";
import "fastify-jwt";
import {
  FastifyInstance,
  FastifyReply,
  FastifyRequest,
  HookHandlerDoneFunction,
} from "fastify";
import { RouteOptions } from "fastify/types/route";
import { jwtHelper } from "common/helpers/JwtHelper";
import { UserSession } from "common/types/UserSession";
import { UnAuthorizedRequestException } from "common/exceptions/UnauthorizedRequestException";
import { MessageResponse } from "common/responses/MessageResponse";

export = (
  server: FastifyInstance,
  parentUrl: string = ""
): RouteOptions | RouteOptions[] => {
  return {
    url: `${parentUrl}/logout`,
    method: "POST",
    preHandler: server.auth([
      (
        req: FastifyRequest,
        resp: FastifyReply,
        done: HookHandlerDoneFunction
      ) => {
        const token = jwtHelper.normalize(req.headers["authorization"] || "");
        if (!token) {
          return done(new UnAuthorizedRequestException());
        }
        try {
          const userSession = server.jwt.verify(token) as UserSession;
          jwtHelper.validateJwtOrReject(token, userSession);
        } catch (e) {
          return done(e);
        }
        done();
      },
    ]),
    handler: async (
      req: FastifyRequest,
      resp: FastifyReply
    ): Promise<MessageResponse> => {
      const token = jwtHelper.normalize(req.headers["authorization"] || "");
      const userSession = server.jwt.decode(token) as UserSession;
      jwtHelper.invalidateJwt(token, userSession);
      return {
        message: "Successful logout",
      };
    },
  };
};
