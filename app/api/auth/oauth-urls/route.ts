import { NextResponse } from "next/server";
import { getGoogleAuthUrl, getGitHubAuthUrl } from "@/lib/oauth";

export async function GET() {
  return NextResponse.json({
    google: getGoogleAuthUrl(),
    github: getGitHubAuthUrl(),
  });
}
