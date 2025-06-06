import { NextResponse } from "next/server";
import { askGemini } from "../../../utils/askGemini";

export async function POST(req: Request) {
  const { prompt } = await req.json();
  const text = await askGemini(prompt);
  return NextResponse.json({ text });
}
