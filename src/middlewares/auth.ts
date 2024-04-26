import { FastifyReply, FastifyRequest, HookHandlerDoneFunction } from "fastify";
import auth from "../config/auth/auth.json";
import jwt from "jsonwebtoken";

interface CustomRequest extends FastifyRequest {
  userId?: string;
}

export let invalidTokens: string[] = [];

export const AuthMiddleware = (
  req: CustomRequest,
  reply: FastifyReply,
  done: HookHandlerDoneFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader)
    return reply.code(401).send({ error: "Token não informado" });

  const parts = authHeader.split(" ");
  if (!(parts.length === 2))
    return reply.code(401).send({ error: "Token mal informado" });

  const [scheme, token] = parts;
  if (!/^Bearer$/i.test(scheme))
    return reply.code(401).send({ error: "Formato de token inválido" });

  if (invalidTokens.includes(token))
    return reply.code(401).send({ error: "Token inválido" });

  jwt.verify(token, auth.secret, (err, decoded) => {
    if (err || !decoded || typeof decoded === "string")
      return reply.code(401).send({ error: "Token inválido" });

    req.userId = decoded.id;

    done();
  });
};
