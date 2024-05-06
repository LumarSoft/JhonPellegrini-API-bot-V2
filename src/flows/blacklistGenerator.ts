import { addKeyword, EVENTS } from "@bot-whatsapp/bot";

export const blacklistGeneratorFlow = addKeyword(EVENTS.ACTION).addAction(
  async (ctx, { blacklist }) => {
    const number = ctx.from;
    blacklist.add(ctx.from);
    console.log(`${ctx.from} added to blacklist`);

    setTimeout(() => {
      blacklist.remove(number);
      console.log(`User ${number} removed from blacklist`);
    }, 1800000);
  }
);
