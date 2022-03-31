## Purpose

This project was completed as part of a group learning exercise. 

## Demo

![Choose a Theme](https://user-images.githubusercontent.com/14803/160981308-c69368b8-90f7-4911-b376-c1df8b18fded.png)

[https://memorization.netlify.app/](https://memorization.netlify.app/)

## Project Features

### User Stories

1. ✅ User can see a grid with n x n cards (n is an integer). All the cards are faced down initially (hidden state)
2. ✅ User can click on any card to unveil the image that is underneath it (change it to visible state). The image will be displayed until the user clicks on a 2nd card
3. ✅ If there is a match, the 2 cards will be eliminated from the game (either hide/remove them or leave them in the visible state)
4. ✅ If there isn't a match, the 2 cards will flip back to their original state (hidden state)
5. ✅ When all the matches have been found, the User can see a dialog box showing a Congratulations message with a counter displaying the time it took to finish the game

## Technical

### Dependencies

- typescript
- react
- remix
- xstate
- tailwindcss

### Game Logic

Decided to use xstate for the game mechanics. 

![Game State Machine](https://user-images.githubusercontent.com/14803/160981255-42d6779f-07e7-4aea-9df5-9ec32ea6b7b1.png)

The diagram for the game state machine was created at [https://statecharts.io/](https://statecharts.io/). Keeping track of this type of state can be complicated, and a state machine helps organize the possible transitions in the game.


```javascript
{
  id: "memorize",
  initial: "choice",

  /* context represents the state we want to store within the machine */
  context: {
    cards: [],
    flipped: [],
    found: [],
    turns: 0,
    done: false,
    start: null,
    end: null,
  },

  /* a hierarchy of states can be defined */
  states: {
    choice: {
      initial: "first",
      always: [
        {
          target: "done",
          /* a function is defined as a "guard" with the name "isDone"
             this transition to target "done" will only happen if the
             cond guard returns true */
          cond: "isDone",
        },
      ],
      states: {
        first: {
          on: {
            /* events can be sent to the machine, this one would be send("flip") */
            flip: { target: "second", actions: "flipCard" },
          },
        },
        second: {
          on: {
            flip: {
              target: "check",
              actions: "flipCard",
              cond: "isUnflipped",
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
      /* at the end when we enter the "done" state trigger an action
         that sets the end time */
      onEntry: "endTimer",
    },
  },
}
```

### Congratulations Animation

The animation that is shown when the game is won is using the [`<marquee>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/marquee) tag.

```jsx
<div className="w-full bg-yellow-400 text-2xl py-6 flex justify-center">
  <marquee>
    {(time / 1000).toFixed(2)} seconds - Congratulations
  </marquee>
</div>
```

It looks like this tag is no longer supported, better use it while we still can.

![Marquee Deprecation](https://user-images.githubusercontent.com/14803/160981479-6f48b8ec-ac5b-4014-865f-1292682b4ed2.png)


## Development

The Netlify CLI starts your app in development mode, rebuilding assets on file changes.

```sh
npm run dev
```

Open up [http://localhost:3000](http://localhost:3000), and you should be ready to go!

## Deployment

```sh
npm run build

netlify deploy

netlify deploy --prod
```
