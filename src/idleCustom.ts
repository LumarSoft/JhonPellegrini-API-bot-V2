import { addKeyword, EVENTS } from "@builderbot/bot";
import { BotContext, TFlow } from "@builderbot/bot/dist/types";

const IDLETIME = 300000;
const timers: Record<string, NodeJS.Timeout> = {};

// Flow for handling inactivity
const idleFlow = addKeyword(EVENTS.ACTION).addAction(async (_, { endFlow }) => {
  return endFlow();
});

// Function to start the inactivity timer for a user
const start = (
  ctx: BotContext,
  gotoFlow: (a: TFlow) => Promise<void>,
  ms: number
) => {
  const nowDate: Date = new Date();
  console.log("start", nowDate);

  timers[ctx.from] = setTimeout(() => {
    const nowDate: Date = new Date();
    console.log("timeout", nowDate);
    return gotoFlow(idleFlow);
  }, ms);
};

// Function to reset the inactivity timer for a user
const reset = (
  ctx: BotContext,
  gotoFlow: (a: TFlow) => Promise<void>,
  ms: number
) => {
  stop(ctx);
  if (timers[ctx.from]) {
    const nowDate: Date = new Date();
    console.log("reset", nowDate);
    clearTimeout(timers[ctx.from]);
  }
  start(ctx, gotoFlow, ms);
};

// Function to stop the inactivity timer for a user
const stop = (ctx: BotContext) => {
  const nowDate: Date = new Date();
  console.log("stop", nowDate);
  if (timers[ctx.from]) {
    clearTimeout(timers[ctx.from]);
  }
};

export { start, reset, stop, idleFlow, IDLETIME };
