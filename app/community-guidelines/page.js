import Link from "next/link";

export default function CommunityGuidelinesPage() {
  return (
    <div className="mx-auto max-w-2xl px-5 py-14">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-forest">Community</p>
      <h1 className="mt-2 font-display text-3xl italic text-indigo">Community Guidelines</h1>
      <p className="mt-4 text-sm text-charcoal/70">
        Civic Bridge Africa is strictly non-partisan. These rules apply to
        every discussion room, and to every role — Youth User, Moderator, and
        Admin alike.
      </p>

      <div className="mt-8 flex flex-col gap-6">
        <div>
          <h2 className="font-display text-lg italic text-indigo">Political neutrality</h2>
          <p className="mt-2 text-sm text-charcoal/70">
            This platform does not promote, feature, or benefit any political
            party, candidate, or ideology. Content and moderation decisions
            are never based on political viewpoint — only on whether a post
            follows these guidelines.
          </p>
        </div>
        <div>
          <h2 className="font-display text-lg italic text-indigo">What&apos;s welcome</h2>
          <ul className="mt-2 list-disc pl-5 text-sm text-charcoal/70">
            <li>Genuine questions about governance, policy, or civic rights</li>
            <li>Personal experience with a process described in the civic content</li>
            <li>Respectful disagreement with another post&apos;s argument, not its author</li>
          </ul>
        </div>
        <div>
          <h2 className="font-display text-lg italic text-indigo">What gets removed</h2>
          <ul className="mt-2 list-disc pl-5 text-sm text-charcoal/70">
            <li>Personal attacks, harassment, or name-calling</li>
            <li>Misinformation presented as fact without a source</li>
            <li>Spam, advertising, or off-topic content</li>
            <li>Anything promoting a specific party, candidate, or ideology</li>
          </ul>
        </div>
        <div>
          <h2 className="font-display text-lg italic text-indigo">How moderation works</h2>
          <p className="mt-2 text-sm text-charcoal/70">
            Moderators and Admins can remove any post that breaks these
            guidelines. Removal is based on the post&apos;s content against
            the rules above, never on the author&apos;s stated opinion.
          </p>
        </div>
      </div>

      <p className="mt-10 text-sm text-charcoal/50">
        Questions about a specific decision? See the{" "}
        <Link href="/faq" className="font-medium text-indigo underline">
          FAQ
        </Link>{" "}
        or head back to the{" "}
        <Link href="/forum" className="font-medium text-indigo underline">
          forum
        </Link>
        .
      </p>
    </div>
  );
}
