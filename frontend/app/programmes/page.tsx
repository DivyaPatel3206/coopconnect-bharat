"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth";
import { api } from "@/lib/api";
import Card from "@/components/Card";

type Programme = {
  id: string;
  name: string;
  category: string | null;
  trainer_name: string | null;
  start_date: string | null;
  location: string | null;
  mode: string;
  description: string | null;
  institution_name: string | null;
};

export default function ProgrammesPage() {
  const { user } = useAuth();
  const [programmes, setProgrammes] = useState<Programme[]>([]);
  const [registeredIds, setRegisteredIds] = useState<Set<string>>(new Set());
  const [busyId, setBusyId] = useState<string | null>(null);

  useEffect(() => {
    api<Programme[]>("/api/programmes").then(setProgrammes).catch(() => {});
  }, []);

  useEffect(() => {
    if (!user) return;
    api<{ programme_id: string }[]>("/api/programmes/mine/registrations")
      .then((regs) => setRegisteredIds(new Set(regs.map((r) => r.programme_id))))
      .catch(() => {});
  }, [user]);

  async function handleRegister(id: string) {
    if (!user) {
      window.location.href = "/login";
      return;
    }
    setBusyId(id);
    try {
      await api(`/api/programmes/${id}/register`, { method: "POST" });
      setRegisteredIds((prev) => new Set(prev).add(id));
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <h1 className="font-display text-3xl font-semibold text-indigo">Training programmes</h1>
      <p className="text-coop-slate mt-1">Run by VAMNICOM and its regional and state institutes.</p>

      <div className="grid md:grid-cols-2 gap-6 mt-8">
        {programmes.map((p) => {
          const isRegistered = registeredIds.has(p.id);
          return (
            <Card key={p.id}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium uppercase tracking-wide text-coop-green">{p.category}</span>
                <span className="text-xs text-coop-slate">{p.mode}</span>
              </div>
              <h2 className="font-display text-lg font-medium text-indigo mt-2">{p.name}</h2>
              <p className="text-sm text-coop-slate mt-1">{p.description}</p>
              <dl className="text-sm mt-4 space-y-1 text-coop-ink">
                <div className="flex gap-2"><dt className="text-coop-slate w-20">Institution</dt><dd>{p.institution_name}</dd></div>
                <div className="flex gap-2"><dt className="text-coop-slate w-20">Trainer</dt><dd>{p.trainer_name}</dd></div>
                <div className="flex gap-2"><dt className="text-coop-slate w-20">Location</dt><dd>{p.location}</dd></div>
                <div className="flex gap-2"><dt className="text-coop-slate w-20">Starts</dt><dd>{p.start_date ? new Date(p.start_date).toLocaleDateString() : "TBA"}</dd></div>
              </dl>
              <button
                onClick={() => handleRegister(p.id)}
                disabled={isRegistered || busyId === p.id}
                className="mt-4 w-full rounded-md bg-indigo text-white font-medium py-2 text-sm hover:bg-indigo-dark transition-colors disabled:opacity-60 focus-ring"
              >
                {isRegistered ? "Registered" : busyId === p.id ? "Registering…" : "Register"}
              </button>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
