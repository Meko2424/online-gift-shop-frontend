import { Link } from "react-router-dom";

type Tile = {
  title: string;
  href: string;
  imageUrl: string;
};

export default function ShopBySection({
  title,
  accentWord,
  tiles,
}: {
  title: string;
  accentWord?: string;
  tiles: Tile[];
}) {
  const [first, ...rest] = title.split(" ");
  const hasAccent = !!accentWord;

  return (
    <section className="bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-14">
        <h2 className="text-4xl font-semibold tracking-tight text-gray-900">
          {hasAccent ? (
            <>
              {first} <span className="text-rose-500">{accentWord}</span>{" "}
              {rest.join(" ")}
            </>
          ) : (
            title
          )}
        </h2>

        <div className="mt-10 grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-6">
          {tiles.map((t) => (
            <Link key={t.href} to={t.href} className="group text-center">
              <div className="mx-auto h-40 w-40 overflow-hidden rounded-full bg-white shadow-sm ring-1 ring-black/5 transition group-hover:shadow-md">
                <img
                  src={t.imageUrl}
                  alt={t.title}
                  className="h-full w-full object-cover transition group-hover:scale-105"
                />
              </div>
              <p className="mt-4 text-base font-medium text-gray-800">
                {t.title}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
