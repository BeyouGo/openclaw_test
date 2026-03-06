import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import fp from "fastify-plugin";
import argon2 from "argon2";
import { env } from "../config";

declare module "fastify" {
  interface FastifyInstance {
    authenticate: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
  }
  interface FastifyJWT {
    payload: { sub: string };
  }
}

export default fp(async function authPlugin(app: FastifyInstance) {
  app.decorate(
    "authenticate",
    async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
      try {
        await request.jwtVerify();
      } catch (err) {
        reply.code(403).send({ error: "FORBIDDEN" });
      }
    }
  );

  app.post("/api/login", async (request, reply) => {
    const body = request.body as { email?: string; password?: string };

    if (!body?.email || !body?.password) {
      return reply.code(400).send({ error: "INVALID_PAYLOAD" });
    }

    const isEmailValid = body.email.toLowerCase() === env.ADMIN_EMAIL.toLowerCase();
    const isPasswordValid = await argon2.verify(env.ADMIN_PASSWORD_HASH, body.password);

    if (!isEmailValid || !isPasswordValid) {
      return reply.code(403).send({ error: "INVALID_CREDENTIALS" });
    }

    const token = app.jwt.sign({ sub: env.ADMIN_EMAIL }, { expiresIn: "1h" });

    return reply.send({ token });
  });
});
