import "fastify-auth";
import "fastify-jwt";
import {
  FastifyInstance,
  FastifyReply,
  FastifyRequest,
  HookHandlerDoneFunction,
} from "fastify";
import { RouteOptions } from "fastify/types/route";
import { userHelper } from "common/helpers/UserHelper";
import { BadRequestException } from "common/exceptions/BadRequestException";
import { MessageResponse } from "common/responses/MessageResponse";
import { User } from "entities/User";

type SignUpDto = {
  login: string;
  lastName: string;
  firstName: string;
  password: string;
  passwordConfirmed: string;
};

export = (
  server: FastifyInstance,
  parentUrl: string = ""
): RouteOptions | RouteOptions[] => {
  return {
    url: `${parentUrl}/signup`,
    method: "POST",
    preHandler: (req, res, done) => {
      let data;
      try {
        if (typeof req.body === "string") {
          data = JSON.parse(req.body as string) as SignUpDto;
        } else {
          data = req.body as SignUpDto;
        }
      } catch (e) {
        return done(new BadRequestException("Wrong data"));
      }
      if (userHelper.isExists(data.login)) {
        return done(new BadRequestException("User already exists"));
      }
      if (data.password !== data.passwordConfirmed) {
        return done(new BadRequestException("Passwords doesnt match"));
      }
      done();
    },
    handler: async (
      req: FastifyRequest,
      resp: FastifyReply
    ): Promise<MessageResponse> => {
      let data;
      try {
        if (typeof req.body === "string") {
          data = JSON.parse(req.body as string) as SignUpDto;
        } else {
          data = req.body as SignUpDto;
        }
      } catch (e) {
        throw new BadRequestException("Wrong data");
      }
      const user: User = data;
      userHelper.createUser(user);
      return {
        message: "Successfull registration",
      };
    },
    schema: {
      body: {
        type: "object",
        required: [
          "login",
          "password",
          "passwordConfirmed",
          "lastName",
          "firstName",
        ],
        properties: {
          login: {
            type: "string",
          },
          firstName: {
            type: "string",
          },
          lastName: {
            type: "string",
          },
          password: {
            type: "string",
          },
          passwordConfirmed: {
            type: "string",
          },
        },
      },
      response: {
        "2xx": {
          message: {
            type: "string",
          },
        },
      },
    },
  };
};
