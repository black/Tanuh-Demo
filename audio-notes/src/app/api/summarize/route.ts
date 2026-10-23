import Anthropic from "@anthropic-ai/sdk";
import { betaZodOutputFormat } from "@anthropic-ai/sdk/helpers/beta/zod";
import { z } from "zod";

export const runtime = "nodejs";

const MAX_TRANSCRIPT_CHARS = 100_000;

const SummarySchema = z.object({
  summary: z.string(),
  tags: z.array(z.string()),
});

const SYSTEM = `You summarise clinical audio notes dictated by a clinician after a patient screening.
Return:
- summary: 1-3 short sentences in neutral clinical third person ("The patient reports..."), covering findings, advice given and any follow-up. No preamble.
- tags: 3-5 short lowercase key points (2-4 words each), e.g. "pain reduced", "avoid spicy food", "follow-up 3 days".
Use only what the transcript says. If it contains no usable content, say so briefly in the summary and return no tags.`;

// Reads ANTHROPIC_API_KEY (or another configured credential) from the server environment.
const client = new Anthropic();

export async function POST(req: Request) {
  let transcript: unknown;
  try {
    ({ transcript } = await req.json());
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 });
  }
  if (typeof transcript !== "string" || !transcript.trim()) {
    return Response.json({ error: "transcript is required" }, { status: 400 });
  }
  if (transcript.length > MAX_TRANSCRIPT_CHARS) {
    return Response.json({ error: "Transcript is too long to summarise" }, { status: 413 });
  }

  try {
    const response = await client.beta.messages.parse({
      model: "claude-opus-5-5",
      max_tokens: 16000,
      output_config: { effort: "low", format: betaZodOutputFormat(SummarySchema) },
      // On a safety decline, let the API re-run the request on its recommended fallback model.
      betas: ["server-side-fallback-2026-07-01"],
      fallbacks: "default",
      system: SYSTEM,
      messages: [{ role: "user", content: `<transcript>\n${transcript}\n</transcript>` }],
    });

    if (response.stop_reason === "refusal" || !response.parsed_output) {
      return Response.json({ error: "Claude could not summarise this note" }, { status: 502 });
    }
    const { summary, tags } = response.parsed_output;
    return Response.json({ summary: summary.trim(), tags: tags.slice(0, 5) });
  } catch (error) {
    if (error instanceof Anthropic.AuthenticationError) {
      return Response.json({ error: "Claude API key is missing or invalid" }, { status: 500 });
    }
    if (error instanceof Anthropic.RateLimitError) {
      return Response.json({ error: "Rate limited, try again shortly" }, { status: 429 });
    }
    if (error instanceof Anthropic.APIError) {
      console.error("summarize API error", error.status, error.message);
      return Response.json({ error: `Claude API error ${error.status ?? ""}`.trim() }, { status: 502 });
    }
    // Missing credentials surface here as a plain Error thrown by the client, before any request.
    console.error("summarize failed", error);
    return Response.json({ error: "check ANTHROPIC_API_KEY is set" }, { status: 500 });
  }
}
