import Fastify from "fastify";
import cors from "@fastify/cors";
import helmet from "@fastify/helmet";
import sensible from "@fastify/sensible";
import jwt from "@fastify/jwt";

import { env, allowedOrigins } from "./config";
import authPlugin from "./plugins/auth";
import { registerInteractionRoutes } from "./routes/interactions";

async function buildServer() {
  const app = Fastify({ logger: true });

  await app.register(sensible);
  await app.register(helmet);
  await app.register(cors, {
    origin: (origin, cb) => {
      if (!origin || allowedOrigins.includes(origin)) {
        cb(null, true);
        return;
      }
      cb(new Error("Origin not allowed"), false);
    },
    credentials: true,
  });
  await app.register(jwt, { secret: env.SESSION_SECRET });
  await app.register(authPlugin);

  app.get("/api/health", async () => ({ status: "ok" }));
  await registerInteractionRoutes(app);

  return app;
}

const start = async () => {
  const app = await buildServer();
  try {
    await app.listen({ port: env.PORT, host: "0.0.0.0" });
    app.log.info(`Server listening on port ${env.PORT}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

void start();
