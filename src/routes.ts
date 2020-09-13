import { FastifyInstance, RouteOptions } from "fastify";
import requireAll from "require-all";

type Route = (
  server: FastifyInstance,
  parentUrl?: string
) => RouteOptions | RouteOptions[];

const registerRoutes = (
  server: FastifyInstance,
  routes: RouteOptions | RouteOptions[]
): void => {
  if (!Array.isArray(routes)) {
    routes = [routes];
  }
  routes.forEach((r) => {
    server.route(r);
  });
};

export = (server: FastifyInstance): void => {
  requireAll({
    dirname: `${__dirname}/routes/`,
    filter: /.*\.[tj]s$/g,
    resolve: (m: Route) => {
      const routeOptions = m(server);
      registerRoutes(server, routeOptions);
    },
  });
};
