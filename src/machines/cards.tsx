import { assign, createMachine } from "xstate";

interface ICardContext {
  cards: ICard[];
  flipped: number[];
  found: number[];
  turns: number;
  done: boolean;
  start: null | number;
  end: null | number;
}

export default createMachine<ICardContext>(
  {
    id: "memorize",
    initial: "choice",
    context: {
      cards: [],
      flipped: [],
      found: [],
      turns: 0,
      done: false,
      start: null,
      end: null,
    },
    states: {
      choice: {
        initial: "first",
        always: [
          {
            target: "done",
            cond: "isDone",
          },
        ],
        states: {
          first: {
            on: {
              flip: { target: "second", actions: "flipCard" },
            },
          },
          second: {
            on: {
              flip: {
                target: "check",
                actions: "flipCard",
                cond: "isFlippable",
              },
            },
          },
          check: {
            invoke: {
              id: "checker",
              src: "checkMatch",
              onDone: {
                target: "first",
                actions: "matched",
              },
              onError: {
                target: "first",
                actions: "unmatched",
              },
            },
          },
        },
      },
      done: {
        onEntry: "endTimer",
      },
    },
  },
  {
    guards: {
      isDone: (context) => context.cards.length === context.found.length,
      isFlippable: (context, event) =>
        context.flipped.includes(event.id) === false &&
        context.found.includes(event.id) === false,
    },
    services: {
      checkMatch: (context) => {
        const [first, second] = context.flipped;

        return new Promise((resolve, reject) => {
          const cards = [
            context.cards.find((card) => card.id === first),
            context.cards.find((card) => card.id === second),
          ];

          if (cards[0] === undefined || cards[1] === undefined) {
            reject();
            return;
          }

          if (cards[0].image !== cards[1].image) {
            setTimeout(reject, 2000);
          } else {
            resolve(null);
          }
        });
      },
    },
    actions: {
      endTimer: assign((context) => ({ end: new Date().getTime() })),
      flipCard: assign((context, event) => {
        if (context.flipped.includes(event.id)) {
          return {};
        }

        return {
          start: context.start === null ? new Date().getTime() : context.start,
          flipped: [...context.flipped, event.id],
        };
      }),
      matched: assign((context, event) => {
        return {
          flipped: [],
          found: [...context.found, context.flipped[0], context.flipped[1]],
          turns: context.turns + 1,
          done: context.found.length + 2 === context.cards.length,
        };
      }),
      unmatched: assign((context, event) => ({
        flipped: [],
        turns: context.turns + 1,
      })),
    },
  }
);
