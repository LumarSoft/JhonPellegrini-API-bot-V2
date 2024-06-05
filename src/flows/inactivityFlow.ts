import { addKeyword, EVENTS } from "@builderbot/bot";

export const inactivityFlow = addKeyword(EVENTS.ACTION).addAction(
  async (_, { endFlow }) => {
    return endFlow("La conversación ha finalizado por inactividad.");
  }
);
