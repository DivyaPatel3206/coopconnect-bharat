"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth";
import { api } from "@/lib/api";
import Card from "@/components/Card";

type Job = {
  id: string;
  title: string;
  description: string | null;
  required_skills: string | null;
  location: string | null;
  company_name: string | null;
  match_score: number | null;
};

export default function JobsPage() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [appliedIds, setAppliedIds] = useState<Set<string>>(new Set());
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    api<Job[]>("/api/jobs").then(setJobs).catch((e) => setError(e.message));
    api<{ job_id: string }[]>("/api/jobs/mine/applications")
      .then((apps) => setAppliedIds(new Set(apps.map((a) => a.job_id))))
      .catch(() => {});
  }, [user]);

  async function apply(id: string) {
    setBusyId(id);
    try {
      await api(`/api/jobs/${id}/apply`, { method: "POST" });
      setAppliedIds((prev) => new Set(prev).add(id));
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <h1 className="font-display text-3xl font-semibold text-indigo">Coop Job Connect</h1>
      <p className="text-coop-slate mt-1">
        Openings matched against your certified skills — every score is explainable, not a black box.
      </p>

      {!user && (
        <p className="mt-8 text-sm text-coop-slate">
          Sign in to see jobs matched to your skill profile.
        </p>
      )}
      {error && <p className="mt-8 text-sm text-red-600">{error}</p>}

      <div className="grid md:grid-cols-2 gap-6 mt-8">
        {jobs.map((j) => {
          const applied = appliedIds.has(j.id);
          return (
            <Card key={j.id}>
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="font-display text-lg font-medium text-indigo">{j.title}</h2>
                  <p className="text-sm text-coop-slate">{j.company_name} · {j.location}</p>
                </div>
                <span
                  className={`text-sm font-semibold rounded-full px-3 py-1 ${
                    (j.match_score || 0) >= 60
                      ? "bg-coop-green/10 text-coop-green"
                      : "bg-coop-saffron/10 text-coop-saffron"
                  }`}
                >
                  {j.match_score}% match
                </span>
              </div>
              <p className="text-sm text-coop-slate mt-3">{j.description}</p>
              {j.required_skills && (
                <p className="text-xs text-coop-slate mt-2">Skills needed: {j.required_skills}</p>
              )}
              <button
                onClick={() => apply(j.id)}
                disabled={applied || busyId === j.id}
                className="mt-4 w-full rounded-md bg-indigo text-white font-medium py-2 text-sm hover:bg-indigo-dark transition-colors disabled:opacity-60 focus-ring"
              >
                {applied ? "Applied" : busyId === j.id ? "Applying…" : "Apply"}
              </button>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
