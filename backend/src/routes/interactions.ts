import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { prisma } from "../lib/prisma";

const interactionSchema = z.object({
  title: z.string().min(3).max(120),
  description: z.string().min(3).max(2000),
  channel: z.string().optional(),
  payload: z.record(z.any()).optional(),
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

      const created = await prisma.interaction.create({
        data: parsed.data,
      });

      return reply.code(201).send({ interaction: created });
    }
  );
}
