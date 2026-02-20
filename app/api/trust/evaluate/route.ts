import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";

export async function POST(request: NextRequest) {
  const session = await getSessionUser();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { prompt, response, model, provider } = body;

  const mockResult = {
    data: {
      final_score: {
        value: 0.87,
        confidence: 0.92,
        risk_level: "low",
      },
      pillar_results: {
        safety: {
          metadata: { name: "Safety", weight: 25 },
          score: { value: 0.91 },
          flags: [],
          status: "passed",
        },
        accuracy: {
          metadata: { name: "Accuracy", weight: 25 },
          score: { value: 0.85 },
          flags: prompt?.length > 100 ? ["Long prompt detected"] : [],
          status: "passed",
        },
        fairness: {
          metadata: { name: "Fairness", weight: 20 },
          score: { value: 0.88 },
          flags: [],
          status: "passed",
        },
        privacy: {
          metadata: { name: "Privacy", weight: 15 },
          score: { value: 0.82 },
          flags: [],
          status: "passed",
        },
        transparency: {
          metadata: { name: "Transparency", weight: 15 },
          score: { value: 0.90 },
          flags: [],
          status: "passed",
        },
      },
    },
  };

  return NextResponse.json(mockResult);
}
