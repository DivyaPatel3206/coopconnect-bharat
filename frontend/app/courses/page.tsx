"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth";
import { api } from "@/lib/api";
import Card from "@/components/Card";

type Lesson = { id: string; title: string; content_type: string; order_index: number };
type Course = { id: string; title: string; description: string | null; skill_tag: string | null; language: string; lessons: Lesson[] };
type Enrollment = { id: string; course_id: string; progress_percent: number; completed: boolean };

export default function CoursesPage() {
  const { user } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [enrollments, setEnrollments] = useState<Record<string, Enrollment>>({});
  const [busyId, setBusyId] = useState<string | null>(null);

  useEffect(() => {
    api<Course[]>("/api/courses").then(setCourses).catch(() => {});
  }, []);

  function loadEnrollments() {
    if (!user) return;
    api<Enrollment[]>("/api/courses/mine/enrollments").then((list) => {
      const map: Record<string, Enrollment> = {};
      list.forEach((e) => (map[e.course_id] = e));
      setEnrollments(map);
    });
  }

  useEffect(loadEnrollments, [user]);

  async function advance(courseId: string, lessonCount: number) {
    if (!user) {
      window.location.href = "/login";
      return;
    }
    const current = enrollments[courseId]?.progress_percent || 0;
    const step = 100 / Math.max(lessonCount, 1);
    const next = Math.min(100, current + step);
    setBusyId(courseId);
    try {
      await api("/api/courses/progress", {
        method: "POST",
        body: JSON.stringify({ course_id: courseId, progress_percent: next }),
      });
      loadEnrollments();
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <h1 className="font-display text-3xl font-semibold text-indigo">Digital learning</h1>
      <p className="text-coop-slate mt-1">
        Self-paced courses, available in English, Hindi and Gujarati. Mark lessons complete as you go —
        finishing a course issues a verifiable certificate automatically.
      </p>

      <div className="grid md:grid-cols-2 gap-6 mt-8">
        {courses.map((c) => {
          const enrollment = enrollments[c.id];
          const progress = enrollment?.progress_percent || 0;
          return (
            <Card key={c.id}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium uppercase tracking-wide text-coop-green">{c.skill_tag}</span>
                <span className="text-xs text-coop-slate">{c.language}</span>
              </div>
              <h2 className="font-display text-lg font-medium text-indigo mt-2">{c.title}</h2>
              <p className="text-sm text-coop-slate mt-1">{c.description}</p>

              <ul className="mt-4 text-sm space-y-1">
                {c.lessons.map((l) => (
                  <li key={l.id} className="flex items-center gap-2 text-coop-ink">
                    <span className="text-xs text-coop-slate uppercase w-10">{l.content_type}</span>
                    {l.title}
                  </li>
                ))}
              </ul>

              <div className="mt-4">
                <div className="flex justify-between text-xs text-coop-slate mb-1">
                  <span>Progress</span>
                  <span>{Math.round(progress)}%{enrollment?.completed ? " · Completed" : ""}</span>
                </div>
                <div className="h-2 rounded-full bg-black/10">
                  <div className="h-2 rounded-full bg-coop-green" style={{ width: `${progress}%` }} />
                </div>
              </div>

              <button
                onClick={() => advance(c.id, c.lessons.length)}
                disabled={busyId === c.id || progress >= 100}
                className="mt-4 w-full rounded-md border border-indigo text-indigo font-medium py-2 text-sm hover:bg-indigo/5 transition-colors disabled:opacity-60 focus-ring"
              >
                {progress >= 100 ? "Course complete" : busyId === c.id ? "Saving…" : "Mark next lesson complete"}
              </button>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
