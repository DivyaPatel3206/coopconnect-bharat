import Link from "next/link";
import JourneyPath from "@/components/JourneyPath";

export default function LandingPage() {
  return (
    <div>
      <section className="max-w-6xl mx-auto px-6 pt-16 pb-20">
        <p className="text-coop-green font-medium text-sm mb-3">
          For VAMNICOM, RICMs, ICMs and cooperative institutions across India
        </p>
        <h1 className="font-display text-4xl md:text-6xl font-semibold text-indigo leading-tight max-w-3xl">
          Empowering cooperative India through learning and opportunity.
        </h1>
        <p className="mt-6 text-lg text-coop-slate max-w-xl">
          One place to join a training programme, learn in your language, earn a
          verifiable certificate, and find the job or venture that comes next.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/programmes"
            className="px-5 py-3 rounded-md bg-indigo text-white font-medium hover:bg-indigo-dark transition-colors focus-ring"
          >
            Explore programmes
          </Link>
          <Link
            href="/courses"
            className="px-5 py-3 rounded-md border border-indigo text-indigo font-medium hover:bg-indigo/5 transition-colors focus-ring"
          >
            Start learning
          </Link>
          <Link
            href="/jobs"
            className="px-5 py-3 rounded-md border border-black/15 text-coop-ink font-medium hover:bg-black/5 transition-colors focus-ring"
          >
            Find opportunities
          </Link>
        </div>

        <div className="mt-16">
          <JourneyPath />
        </div>
      </section>

      <section className="bg-white border-y border-black/10">
        <div className="max-w-6xl mx-auto px-6 py-16 grid md:grid-cols-3 gap-8">
          {[
            { title: "Training management", desc: "Programme creation, online registration and nomination tracking for institutions." },
            { title: "Digital learning", desc: "Multilingual courses with offline access, built for low-connectivity areas." },
            { title: "Skill certification", desc: "QR-verifiable certificates that travel with a trainee for life." },
            { title: "Career guidance", desc: "Recommendations grounded in a trainee's actual skills and training history." },
            { title: "Employment exchange", desc: "A transparent match score connects trainees to relevant, real openings." },
            { title: "National analytics", desc: "Outreach, completion and employment outcomes, visible by institution and state." },
          ].map((f) => (
            <div key={f.title}>
              <h3 className="font-display text-lg font-medium text-indigo mb-2">{f.title}</h3>
              <p className="text-sm text-coop-slate">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
