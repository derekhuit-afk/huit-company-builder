import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams?.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
  const { data } = await supabaseAdmin.from("cb_proposals").select("*, cb_leads(name, email, phone)").eq("id", id).maybeSingle();
  if (!data) return NextResponse.json({ error: "Proposal not found" }, { status: 404 });
  // Mark as viewed
  if (!data.viewed_at) await supabaseAdmin.from("cb_proposals").update({ viewed_at: new Date().toISOString() }).eq("id", id);
  return NextResponse.json(data);
}
