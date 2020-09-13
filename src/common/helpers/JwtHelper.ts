import { UserSession } from "common/types/UserSession";
import { jwtPath } from "utils/jwtpath";
import * as fs from "fs";
import { JwtCache } from "common/types/JwtCache";
import { JWT_EXPIRE_SECONDS } from "../../constants";
import { join } from "path";
import { UnAuthorizedRequestException } from "common/exceptions/UnauthorizedRequestException";
import { ForbiddenRequestException } from "common/exceptions/ForbiddenRequestException";

export const jwtHelper = {
  writeJwt: (token: string, userSession: UserSession) => {
    const path = jwtPath();
    if (!fs.existsSync(path)) {
      fs.mkdirSync(path, {
        recursive: true,
      });
    }
    const jwtCache: JwtCache = {
      token: token,
      iat: userSession.timestamp,
      ttl: JWT_EXPIRE_SECONDS,
    };
    fs.writeFileSync(join(path, userSession.login), JSON.stringify(jwtCache));
  },

  invalidateJwt: (token: string, userSession: UserSession): boolean => {
    const path = jwtPath();
    try {
      fs.unlinkSync(join(path, userSession.login));
      return true;
    } catch (e) {
      return false;
    }
  },

  validateJwtOrReject: (token: string, userSession: UserSession): true => {
    const path = jwtPath();
    let jwt;
    try {
      jwt = JSON.parse(
        fs.readFileSync(join(path, userSession.login), "utf-8")
      ) as JwtCache;
    } catch (e) {
      throw new UnAuthorizedRequestException();
    }

    if (jwt.token !== token) {
      throw new UnAuthorizedRequestException();
    }

    if (jwt.iat + jwt.ttl <= +(Date.now() / 1000).toFixed(0)) {
      throw new ForbiddenRequestException();
    }
    return true;
  },

  normalize: (token: string): string => {
    if (token.startsWith("Bearer")) {
      token = token.substring("Bearer".length);
    } else if (token.startsWith("Basic")) {
      token = token.substring("Basic".length);
    }
    return token.trim();
  },
};
