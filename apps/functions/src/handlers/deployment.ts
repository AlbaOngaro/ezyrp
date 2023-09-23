import fastify, { RouteHandlerMethod } from "fastify";

export const deployment: RouteHandlerMethod = async (request, response) => {
  console.log(request.body);
  response.send({ hello: "world" });
};
