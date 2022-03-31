import type { LoaderFunction } from "remix";
import { useLoaderData, json } from "remix";
import useCards from "~/hooks/useCards";
import Card from "~/components/Card";
import shuffle from "~/utils/shuffle";
import images from "~/data/images.json";

type ImageKey = keyof typeof images;

const CARD_COUNT = 16;
const DEFAULT_THEME: "food" = "food";

export const loader: LoaderFunction = ({ request, params }) => {
  if (
    params.theme === undefined ||
    Object.keys(images).includes(params.theme) === false
  ) {
    throw new Error("Must provide valid theme type");
  }

  const key: ImageKey = (params.theme as ImageKey) || DEFAULT_THEME;

  const all = new Set(images[key]);
  const available = [];

  for (let i = 0; i < CARD_COUNT / 2; ++i) {
    const image = Array.from(all)[Math.floor(Math.random() * all.size)];

    available.push(image);
    available.push(image);

    all.delete(image);
  }

  const shuffled = shuffle(available);

  const cards = Array(CARD_COUNT)
    .fill({ id: null, image: null })
    .map((card, index) => ({
      ...card,
      id: index,
      image: `${key}/${shuffled[index]}`,
    }));

  return json({
    cards,
  });
};

export default function GameTheme() {
  const { cards } = useLoaderData<{ cards: ICard[] }>();

  const { flipped, found, turns, flip, time } = useCards(cards);

  return (
    <section className="h-full flex flex-col items-center">
      <div className="w-full p-4 bg-gray-200">
        <h2 className="text-xl">Turns: {turns}</h2>
        <h2 className="text-xl">Found: {found.length / 2}</h2>
      </div>
      <div className="flex justify-center">
        <div className="p-4 w-fit grid grid-cols-4 gap-2">
          {cards.map(({ id, ...card }) => (
            <Card
              key={id}
              card={card}
              flipped={flipped.includes(id)}
              found={found.includes(id)}
              flip={flip(id)}
            />
          ))}
        </div>
      </div>
      {time && (
        <div className="w-full bg-yellow-400 text-2xl py-6 flex justify-center">
          <marquee>
            {(time / 1000).toFixed(2)} seconds - Congratulations
          </marquee>
        </div>
      )}
    </section>
  );
}
