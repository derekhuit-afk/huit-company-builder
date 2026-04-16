import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET(req: NextRequest) {
  const token = req.nextUrl.(searchParams?.get ?? "")("token");
  if (!token) return NextResponse.json({ error: "Missing token" }, { status: 400 });
  const { data: client } = await supabaseAdmin.from("cb_clients").select("*").eq("portal_token", token).maybeSingle();
  if (!client) return NextResponse.json({ error: "Portal not found" }, { status: 404 });
  const { data: phases } = await supabaseAdmin.from("cb_phases").select("*").eq("client_id", client.id).order("phase_number");
  return NextResponse.json({ client, phases: phases || [] });
}
