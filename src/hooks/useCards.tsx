import { useMachine } from "@xstate/react";
import cardMachine from "~/machines/cards";

export default function useCards(cards: ICard[]) {
  const [state, send] = useMachine(cardMachine, {
    context: { cards },
    devTools: true,
  });

  return {
    cards: state.context.cards,
    flipped: state.context.flipped,
    found: state.context.found,
    flip: (id: number) => () => send("flip", { id }),
    turns: state.context.turns,
    time:
      state.context.end && state.context.start
        ? state.context.end - state.context.start
        : null,
  };
}
