import Link from "next/link";

const LEARN_LINKS = [
  { href: "/civic-content", label: "Civic Content" },
  { href: "/quizzes", label: "Quizzes" },
  { href: "/regional-tracker", label: "Regional Tracker" },
];

const COMMUNITY_LINKS = [
  { href: "/forum", label: "Forum" },
  { href: "/community-guidelines", label: "Community Guidelines" },
  { href: "/faq", label: "FAQ" },
  { href: "https://github.com/nellybutera/civic-bridge", label: "Source code" },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-line bg-indigo text-ivory">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 sm:grid-cols-2 md:grid-cols-3">
        <div>
          <p className="font-display text-lg italic text-ivory">Civic Bridge Africa</p>
          <p className="mt-3 max-w-xs text-sm text-ivory/60">
            Governance, parliament and regional integration in plain
            language, built for the youth who have to live with the
            decisions.
          </p>
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.15em] text-ivory/40">Learn</p>
          <ul className="mt-3 flex flex-col gap-2">
            {LEARN_LINKS.map((l) => (
              <li key={l.label}>
                <Link href={l.href} className="text-sm text-ivory/70 hover:text-ivory">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.15em] text-ivory/40">Community</p>
          <ul className="mt-3 flex flex-col gap-2">
            {COMMUNITY_LINKS.map((l) => (
              <li key={l.label}>
                <Link href={l.href} className="text-sm text-ivory/70 hover:text-ivory">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t border-ivory/10 px-5 py-5">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-2 text-xs text-ivory/40 sm:flex-row sm:items-center">
          <p>© {year} Civic Bridge Africa</p>
          <p className="font-mono uppercase tracking-wide">Data: AU · EAC · National archives</p>
        </div>
      </div>
    </footer>
  );
}
