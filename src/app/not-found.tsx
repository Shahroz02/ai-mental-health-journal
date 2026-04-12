import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-serene-cream px-6 text-serene-deep">
      <h1 className="font-serif text-2xl">Page not found</h1>
      <p className="mt-2 text-sm text-serene-deep/80">
        The page you are looking for does not exist.
      </p>
      <Link
        href="/"
        className="mt-6 rounded-full bg-serene-forest px-6 py-2 text-sm text-white"
      >
        Back home
      </Link>
    </div>
  );
}
