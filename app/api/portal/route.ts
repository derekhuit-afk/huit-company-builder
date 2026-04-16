import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");
  if (!token) return NextResponse.json({ error: "Missing token" }, { status: 400 });

  const { data: client, error } = await supabaseAdmin
    .from("clients").select("*").eq("portal_token", token).single();
  if (error || !client) return NextResponse.json({ error: "Portal not found" }, { status: 404 });
  return NextResponse.json({ client });
}
