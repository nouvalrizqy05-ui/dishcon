import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
  if (!supabase) return NextResponse.json({ data: [] });
  const { data, error } = await supabase.from("surplus_listings").select("*").eq("status", "active").order("created_at", { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data });
}
