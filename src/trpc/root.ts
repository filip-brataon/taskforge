import { create } from "domain";
import { taskRouter } from "./routers/task";

export const appRouter = createTRPCRouter({
  task: taskRouter,
});