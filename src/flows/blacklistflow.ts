import { addKeyword, EVENTS } from "@builderbot/bot";

export const blackListFlow = addKeyword(EVENTS.ACTION).addAction(
  async (ctx, { blacklist, globalState, endFlow }) => {
    const number = ctx.from;
    const deservesBL = globalState.get("readyForBL");

    if (deservesBL) {
      blacklist.add(ctx.from);
      console.log(`${ctx.from} added to blacklist`);
      startTimer(number, 1800000, blacklist);
      return endFlow(
        "Gracias por comunicarte con nosotros. A la brevedad contestaremos tu consulta."
      );
    } else {
      return endFlow("Gracias por comunicarte con nosotros.");
    }
  }
);

const startTimer = (number: string, ms: number, blacklist: any) => {
  setTimeout(() => {
    blacklist.remove(number);
    console.log(`User ${number} removed from blacklist`);
  }, ms);
};
