import Link from "next/link";

const FAQS = [
  {
    q: "Do I need an account to use Civic Bridge Africa?",
    a: "No. Guests can read every civic content article, preview quizzes and forum threads, and view the regional tracker without an account. You only need an account to take a quiz, post in the forum, or save results.",
  },
  {
    q: "What does creating an account get me?",
    a: "Signing up always creates a Youth User account: you can take quizzes with your scores saved, and post and reply in the forum. Moderator and Admin roles are assigned by the project team, not through sign-up.",
  },
  {
    q: "Where does the civic content come from?",
    a: "Every article links to its original public source (an AU, EAC, or parliamentary page) — look for the source link under each article on the Civic Content page. Summaries are for informational purposes only; refer to the original source for anything legally binding.",
  },
  {
    q: "How is a forum post moderated or removed?",
    a: "Moderators and Admins can remove any post that breaks the Community Guidelines. See that page for exactly what's and isn't allowed.",
  },
  {
    q: "I found a bug or something looks wrong. How do I report it?",
    a: "Open an issue on the project's GitHub repository, linked in the footer, with what you saw and what you expected instead.",
  },
  {
    q: "The site feels slow the first time I load it — is something broken?",
    a: "No — the backend runs on a free-tier server that sleeps when idle. The very first request after a period of inactivity can take up to a couple of minutes to wake it up; everything after that is fast.",
  },
];

export default function FaqPage() {
  return (
    <div className="mx-auto max-w-2xl px-5 py-14">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-forest">Help</p>
      <h1 className="mt-2 font-display text-3xl italic text-indigo">Frequently asked questions</h1>

      <div className="mt-8 flex flex-col gap-4">
        {FAQS.map((item) => (
          <div key={item.q} className="rounded-xl border border-line bg-white p-5">
            <h2 className="font-medium text-indigo">{item.q}</h2>
            <p className="mt-2 text-sm text-charcoal/70">{item.a}</p>
          </div>
        ))}
      </div>

      <p className="mt-10 text-sm text-charcoal/50">
        Looking for the rules on discussions instead?{" "}
        <Link href="/community-guidelines" className="font-medium text-indigo underline">
          Community Guidelines
        </Link>
        .
      </p>
    </div>
  );
}
