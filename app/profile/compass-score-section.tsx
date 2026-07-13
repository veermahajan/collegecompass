"use client";

import { useEffect, useState } from "react";
import { Card, CardTitle, CardBody } from "@/components/ui/card";

// Phase A4 — renders only the four visible subscores. There is no fifth
// axis, no toggle, no "advanced" view that reveals Context — it does not
// exist in this component's data type at all (see VisibleScores below,
// which mirrors lib/compass-score.ts's VisibleCompassScores).

type VisibleScores = {
  academicsScore: number;
  honorsScore: number;
  extracurricularsScore: number;
  essaysScore: number;
  computedAt: string;
};

const AXES: { key: keyof Omit<VisibleScores, "computedAt">; label: string }[] = [
  { key: "academicsScore", label: "Academics" },
  { key: "honorsScore", label: "Honors" },
  { key: "extracurricularsScore", label: "Extracurriculars" },
  { key: "essaysScore", label: "Essays" },
];

const SIZE = 260;
const CENTER = SIZE / 2;
const MAX_RADIUS = 92;
const RINGS = [0.25, 0.5, 0.75, 1];

function pointOnAxis(index: number, radius: number): [number, number] {
  // 4 axes, 90° apart, starting straight up.
  const angle = (Math.PI / 2) * index - Math.PI / 2;
  return [CENTER + radius * Math.cos(angle), CENTER + radius * Math.sin(angle)];
}

function polygonPoints(scores: number[]): string {
  return scores
    .map((score, i) => pointOnAxis(i, (score / 100) * MAX_RADIUS).join(","))
    .join(" ");
}

function RadarChart({ scores }: { scores: number[] }) {
  return (
    <svg
      width={SIZE}
      height={SIZE}
      viewBox={`0 0 ${SIZE} ${SIZE}`}
      className="h-auto w-full max-w-[260px]"
    >
      {RINGS.map((ring) => (
        <polygon
          key={ring}
          points={polygonPoints([100, 100, 100, 100].map((v) => v * ring))}
          fill="none"
          stroke="rgba(15,23,42,0.12)"
          strokeWidth={1}
        />
      ))}
      {AXES.map((_, i) => {
        const [x, y] = pointOnAxis(i, MAX_RADIUS);
        return (
          <line
            key={i}
            x1={CENTER}
            y1={CENTER}
            x2={x}
            y2={y}
            stroke="rgba(15,23,42,0.12)"
            strokeWidth={1}
          />
        );
      })}
      <polygon
        points={polygonPoints(scores)}
        fill="rgba(59, 130, 246, 0.25)"
        stroke="#3B82F6"
        strokeWidth={2}
      />
      {AXES.map((axis, i) => {
        const [x, y] = pointOnAxis(i, MAX_RADIUS + 22);
        return (
          <text
            key={axis.key}
            x={x}
            y={y}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize={12}
            fill="#475569"
          >
            {axis.label}
          </text>
        );
      })}
    </svg>
  );
}

export function CompassScoreSection() {
  const [scores, setScores] = useState<VisibleScores | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");

  useEffect(() => {
    let cancelled = false;
    fetch("/api/compass-score")
      .then(async (res) => {
        if (!res.ok) throw new Error("failed");
        return res.json() as Promise<VisibleScores>;
      })
      .then((data) => {
        if (!cancelled) {
          setScores(data);
          setStatus("ready");
        }
      })
      .catch(() => {
        if (!cancelled) setStatus("error");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <Card className="mb-10">
      <CardTitle>Compass Score</CardTitle>
      <CardBody className="mb-6">
        This resource is directional, not predictive. No tool can promise an admission
        decision, and we don't claim to do so. This is a self-assessment snapshot of your profile as it
        stands today, meant to guide you in deciding where to focus next.
      </CardBody>

      {status === "loading" && (
        <p className="text-[0.9rem] text-ink-soft">Calculating…</p>
      )}
      {status === "error" && (
        <p className="text-[0.9rem] text-ink-soft">
          We couldn&apos;t load your Compass Score right now. Try refreshing the page, and <a target="_blank" href="../feedback/page.tsx">leave us feedback</a> if there are any issues.
        </p>
      )}
      {status === "ready" && scores && (
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start sm:justify-around">
          <RadarChart
            scores={[
              scores.academicsScore,
              scores.honorsScore,
              scores.extracurricularsScore,
              scores.essaysScore,
            ]}
          />
          <ul className="flex flex-col gap-2 text-[0.9rem] text-ink">
            {AXES.map((axis) => (
              <li key={axis.key} className="flex items-center justify-between gap-8">
                <span className="text-ink-soft">{axis.label}</span>
                <span className="font-semibold">{scores[axis.key]}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </Card>
  );
}
