import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { Prisma } from "../generated/prisma/client";
import { prisma } from "../lib/prisma";

const interactionSchema = z.object({
  title: z.string().min(3).max(120),
  description: z.string().min(3).max(2000),
  channel: z.string().optional(),
  payload: z.record(z.string(), z.any()).optional(),
});

export async function registerInteractionRoutes(app: FastifyInstance) {
  app.get(
    "/api/interactions",
    { preHandler: [app.authenticate] },
    async () => {
      const interactions = await prisma.interaction.findMany({
        orderBy: { createdAt: "desc" },
        take: 50,
      });
      return { interactions };
    }
  );

  app.post(
    "/api/interactions",
    { preHandler: [app.authenticate] },
    async (request, reply) => {
      const parsed = interactionSchema.safeParse(request.body);
      if (!parsed.success) {
        return reply.code(400).send({ error: "INVALID_PAYLOAD", details: parsed.error.flatten() });
      }

      const payload = parsed.data.payload as Prisma.InputJsonValue | undefined;

      const created = await prisma.interaction.create({
        data: {
          title: parsed.data.title,
          description: parsed.data.description,
          channel: parsed.data.channel ?? "portal",
          payload,
        },
      });

      return reply.code(201).send({ interaction: created });
    }
  );
}
