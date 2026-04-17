import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  const { data, error } = await supabaseAdmin
    .from("cb_proposals")
    .select("*, cb_leads(name, email, phone, company_name, product_type)")
    .eq("id", id)
    .single();

  if (error || !data) return NextResponse.json({ error: "Proposal not found" }, { status: 404 });
  return NextResponse.json(data);
}
