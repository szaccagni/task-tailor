import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "../trpc";
import { todoInput } from '../../../utils/types'

export const todoRouter = createTRPCRouter({
  all: protectedProcedure.query(async ({ ctx }) => {
    const todos = await ctx.prisma.todo.findMany({
        where: {
            userId: ctx.session.user.id
        }
    })
    return todos.map(({id, title, description, done}) => ({id, title, description, done}))
    // return [
    //     {
    //         id: '1',
    //         title: 'task 1',
    //         description: 'this is the first fake test task',
    //         dueDate: Date.now(),
    //     },
    //     {
    //         id: '2',
    //         title: 'task 2',
    //         description: 'this is the second fake test task',
    //         dueDate: Date.now(),
    //         inProgress: true
    //     },
    //     {
    //         id: '3',
    //         title: 'task 3',
    //         description: 'this is the third fake test task',
    //         dueDate: Date.now(),
    //         done: true
    //     }
    // ]
  }),

  create: protectedProcedure.input(todoInput).mutation(async ({ctx, input}) => {
    return ctx.prisma.todo.create({
        data: {
            title: 'placeholder',
            description: input,
            dueDate : new Date(),
            user: {
              connect: {
                id: ctx.session.user.id,
              },
            },
          },
        })
    }),
  delete: protectedProcedure.input(z.string()).mutation(async ({ctx, input}) => {
    return ctx.prisma.todo.delete({
        where: {
            id: input
          },
        })
    })
});