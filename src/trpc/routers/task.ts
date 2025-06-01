import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const taskRouter = createTRPCRouter({
  create: protectedProcedure
    .input(z.object({ title: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.task.create({
        data: {
          title: input.title,
          userId: ctx.session.user.id,
        },
      });
    }),

  getAll: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.task.findMany({
      where: { userId: ctx.session.user.id },
      orderBy: { createdAt: "desc" },
    });
  }),

  toggleComplete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const task = await ctx.prisma.task.findUnique({
        where: { id: input.id },
      });
      if (!task || task.userId !== ctx.session.user.id) {
        throw new Error("Not authorized");
      }
      return ctx.prisma.task.update({
        where: { id: input.id },
        data: { completed: !task.completed },
      });
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const task = await ctx.prisma.task.findUnique({
        where: { id: input.id },
      });
      if (!task || task.userId !== ctx.session.user.id) {
        throw new Error("Not authorized");
      }
      return ctx.prisma.task.delete({
        where: { id: input.id },
      });
    }),
});
