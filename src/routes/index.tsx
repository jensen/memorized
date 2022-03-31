import { LoaderFunction, useLoaderData } from "remix";
import { Link, json } from "remix";
import images from "~/data/images.json";

type ImageKey = keyof typeof images;

function random<T>(list: T[]) {
  return list[Math.floor(Math.random() * list.length)];
}

export const loader: LoaderFunction = () => {
  const keys = Object.keys(images) as ImageKey[];

  const themes = keys.map((key) => {
    return {
      name: key,
      image: `/images/${key}/${random(images[key])}`,
    };
  });

  return json({
    themes,
  });
};

export default function Index() {
  const { themes } = useLoaderData<{ themes: ITheme[] }>();

  return (
    <section className="h-full flex flex-col items-center">
      <h1 className="my-8 text-white text-xl">Choose a Theme</h1>
      <ul className="grid gap-8 grid-cols-2 sm:grid-cols-3">
        {themes.map((theme) => (
          <li
            key={theme.name}
            className="w-36 h-32 p-2 flex flex-col items-center rounded-xl border-2 border-blue-900 hover:border-blue-400"
          >
            <Link to={`/${theme.name}`} className="contents space-y-2">
              <img src={theme.image} className="w-24 h-24" alt="" />
              <span className="text-white bg-blue-700 px-2 rounded-sm">
                {theme.name}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
