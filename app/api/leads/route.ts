import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";

const leadSchema = z.object({
  name: z.string().trim().min(2, "Enter your name.").max(120, "Name is too long."),
  email: z.string().trim().email("Enter a valid email address.").max(254, "Email is too long."),
  company: z.string().trim().min(2, "Enter your company.").max(160, "Company is too long."),
  role: z.string().trim().min(2, "Enter your role.").max(120, "Role is too long."),
  challenge: z.string().trim().max(2000, "Please keep this under 2,000 characters.").optional().default(""),
  // Spam checks: a hidden field people never see, and how long the form was open before sending.
  hp_extra: z.string().optional().default(""),
  elapsed: z.coerce.number().optional(),
});

// Submissions sent faster than a person could fill the form are treated as bots.
const MIN_FILL_MS = 2500;

function getSupabaseAdmin() {
  const supabaseUrl = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServerKey = process.env.SUPABASE_SECRET_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServerKey) {
    throw new Error("Supabase server credentials are not configured.");
  }

  return createClient(supabaseUrl, supabaseServerKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, message: "Please submit the form again." },
      { status: 400 },
    );
  }

  const result = leadSchema.safeParse(body);

  if (!result.success) {
    const fields = Object.fromEntries(
      Object.entries(result.error.flatten().fieldErrors).map(([field, messages]) => [
        field,
        messages?.[0] ?? "Check this field.",
      ]),
    );

    return NextResponse.json(
      {
        ok: false,
        message: "Please check the required details.",
        fields,
      },
      { status: 422 },
    );
  }

  const { hp_extra: trap, elapsed, ...lead } = result.data;

  // Looks like a bot: answer as if it worked, but store nothing.
  const droppedReason = trap.trim() !== "" ? "hidden field filled" : typeof elapsed === "number" && elapsed < MIN_FILL_MS ? "sent too fast" : "";
  if (droppedReason) {
    console.info("Lead dropped as bot", { reason: droppedReason });
    return NextResponse.json({ ok: true, lead: { name: lead.name, email: lead.email, company: lead.company, role: lead.role } }, { status: 201 });
  }

  try {
    const supabase = getSupabaseAdmin();
    let { error } = await supabase.from("leads").insert({
      ...lead,
      source: "website",
    });

    // If the challenge column has not been added to the database yet,
    // still save the core lead instead of losing it.
    if (error && (error.code === "PGRST204" || error.code === "42703")) {
      console.warn("Lead extra columns missing; saving core fields only. Run the latest Supabase migration.");
      const { challenge: _challenge, ...core } = lead;
      void _challenge;
      ({ error } = await supabase.from("leads").insert({ ...core, source: "website" }));
    }

    if (error) {
      console.error("Lead storage failed", { code: error.code, message: error.message });
      return NextResponse.json(
        { ok: false, message: "We could not save your details. Please try again." },
        { status: 503 },
      );
    }
  } catch (error) {
    console.error("Lead storage is unavailable", error instanceof Error ? error.message : "Unknown error");
    return NextResponse.json(
      { ok: false, message: "We could not save your details. Please try again." },
      { status: 503 },
    );
  }

  return NextResponse.json({ ok: true, lead }, { status: 201 });
}
