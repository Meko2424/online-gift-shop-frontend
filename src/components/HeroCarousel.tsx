import { Link } from "react-router-dom";

type Slide = {
  title: string;
  subtitle: string;
  cta: string;
  href: string;
  imageUrl: string;
};

export default function HeroCarousel({ slides }: { slides: Slide[] }) {
  const s = slides[0]; // simple first slide for now

  return (
    <section className="bg-white">
      <div className="mx-auto max-w-7xl px-4 py-10">
        <div className="overflow-hidden rounded-3xl border bg-white shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2">
            <div className="p-10 md:p-14">
              <p className="text-sm font-semibold text-gray-600">
                Premium gifts delivered with care
              </p>
              <h1 className="mt-3 text-4xl font-semibold tracking-tight text-gray-900">
                {s.title}
              </h1>
              <p className="mt-4 text-lg text-gray-600">{s.subtitle}</p>

              <div className="mt-8 flex items-center gap-3">
                <Link
                  to={s.href}
                  className="rounded-full bg-black px-6 py-3 text-sm font-semibold text-white hover:bg-gray-900"
                >
                  {s.cta}
                </Link>
                <Link
                  to="/c/best-sellers"
                  className="rounded-full border px-6 py-3 text-sm font-semibold text-gray-900 hover:bg-gray-50"
                >
                  Best Sellers
                </Link>
              </div>
            </div>

            <div className="relative min-h-[320px] md:min-h-[420px]">
              <img
                src={s.imageUrl}
                alt={s.title}
                className="absolute inset-0 h-full w-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
