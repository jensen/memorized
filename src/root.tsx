import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  Link,
} from "remix";
import type { MetaFunction } from "remix";
import styles from "./styles/main.css";

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "memorized.",
  viewport: "width=device-width,initial-scale=1",
});

export function links() {
  return [
    { rel: "preconnect", href: "https://fonts.googleapis.com", key: "" },
    {
      rel: "preconnect",
      href: "https://fonts.googleapis.com",
      crossOrigin: "true",
    },
    {
      rel: "stylesheet",
      href: "https://fonts.googleapis.com/css2?family=Bungee&display=swap",
    },
    { rel: "stylesheet", href: styles },
  ];
}

export default function App() {
  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body className="flex flex-col">
        <header className="w-full p-4 bg-gray-300 flex justify-center">
          <h1 className="text-4xl sm:text-6xl bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 bg-clip-text text-transparent">
            <Link to="/">memorized</Link>
          </h1>
        </header>
        <Outlet />
        <footer className="bg-white px-4 py-2 text-slate-400">
          Made by <a href="https://github.com/jensen">@jensen</a>
        </footer>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
