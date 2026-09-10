"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth";
import { api } from "@/lib/api";
import Card from "@/components/Card";

type Enrollment = { id: string; course_id: string; progress_percent: number; completed: boolean };
type Registration = { id: string; programme_id: string; status: string };
type Certificate = { id: string; verification_id: string; programme_name: string; skill: string | null };
type Analytics = {
  total_trainees: number;
  total_programmes: number;
  total_certificates: number;
  total_jobs: number;
  completion_rate: number;
};

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [analytics, setAnalytics] = useState<Analytics | null>(null);

  useEffect(() => {
    if (!user) return;
    api<Enrollment[]>("/api/courses/mine/enrollments").then(setEnrollments).catch(() => {});
    api<Registration[]>("/api/programmes/mine/registrations").then(setRegistrations).catch(() => {});
    api<Certificate[]>("/api/certificates").then(setCertificates).catch(() => {});
    api<Analytics>("/api/analytics/national").then(setAnalytics).catch(() => {});
  }, [user]);

  if (loading) return <div className="max-w-6xl mx-auto px-6 py-16 text-coop-slate">Loading…</div>;

  if (!user) {
    return (
      <div className="max-w-md mx-auto px-6 py-16 text-center">
        <p className="text-coop-slate">Sign in to see your dashboard.</p>
        <Link href="/login" className="text-indigo font-medium hover:underline">Sign in</Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <h1 className="font-display text-3xl font-semibold text-indigo">Welcome, {user.name.split(" ")[0]}</h1>
      <p className="text-coop-slate mt-1">Here's where your learning journey stands today.</p>

      <div className="grid md:grid-cols-3 gap-6 mt-8">
        <Card>
          <h2 className="font-display text-lg font-medium text-indigo mb-4">My learning</h2>
          {enrollments.length === 0 && <p className="text-sm text-coop-slate">No courses started yet.</p>}
          <ul className="space-y-3">
            {enrollments.map((e) => (
              <li key={e.id}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-coop-ink">{e.course_id.slice(0, 8)}…</span>
                  <span className="text-coop-slate">{Math.round(e.progress_percent)}%</span>
                </div>
                <div className="h-2 rounded-full bg-black/10">
                  <div
                    className="h-2 rounded-full bg-coop-green"
                    style={{ width: `${e.progress_percent}%` }}
                  />
                </div>
              </li>
            ))}
          </ul>
          <Link href="/courses" className="inline-block mt-4 text-sm text-indigo font-medium hover:underline">
            Browse courses →
          </Link>
        </Card>

        <Card>
          <h2 className="font-display text-lg font-medium text-indigo mb-4">My training programmes</h2>
          {registrations.length === 0 && <p className="text-sm text-coop-slate">No registrations yet.</p>}
          <ul className="space-y-2">
            {registrations.map((r) => (
              <li key={r.id} className="flex justify-between text-sm">
                <span className="text-coop-ink">{r.programme_id.slice(0, 8)}…</span>
                <span className="capitalize text-coop-slate">{r.status}</span>
              </li>
            ))}
          </ul>
          <Link href="/programmes" className="inline-block mt-4 text-sm text-indigo font-medium hover:underline">
            Explore programmes →
          </Link>
        </Card>

        <Card>
          <h2 className="font-display text-lg font-medium text-indigo mb-4">My certificates</h2>
          {certificates.length === 0 && <p className="text-sm text-coop-slate">Complete a course to earn your first certificate.</p>}
          <ul className="space-y-3">
            {certificates.map((c) => (
              <li key={c.id} className="border border-black/10 rounded-md p-3">
                <p className="text-sm font-medium text-coop-ink">{c.programme_name}</p>
                <p className="text-xs text-coop-slate mt-1">ID: {c.verification_id}</p>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      {analytics && (
        <div className="mt-10">
          <h2 className="font-display text-lg font-medium text-indigo mb-4">Platform snapshot</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Trainees", value: analytics.total_trainees },
              { label: "Programmes", value: analytics.total_programmes },
              { label: "Certificates issued", value: analytics.total_certificates },
              { label: "Open jobs", value: analytics.total_jobs },
            ].map((s) => (
              <Card key={s.label} className="text-center">
                <p className="font-display text-3xl text-indigo">{s.value}</p>
                <p className="text-xs text-coop-slate mt-1">{s.label}</p>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
