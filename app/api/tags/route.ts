import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      slug,
      tenant_id,
      item_id,
      item_name,
      experience_type,
      tap_url,
      status,
      sections,
      description,
      message,
      message_from,
      coupon_code,
      coupon_discount,
    } = body;

    if (!slug || !item_id) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("tags")
      .upsert(
        {
          tenant_id,
          item_id,
          item_name,
          experience_type,
          tap_url,
          status: status || "preview",
          sections,
          description,
          message,
          message_from,
          coupon_code,
          coupon_discount,
        },
        { onConflict: "tap_url" }
      )
      .select()
      .single();

    if (error) {
      console.error("Supabase tags error:", error);
      return NextResponse.json({ error: "Failed to save tag" }, { status: 500 });
    }

    return NextResponse.json({ success: true, data, slug, tap_url });
  } catch (error) {
    console.error("Tags route error:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get("slug");

    if (slug) {
      const { data, error } = await supabase
        .from("tags")
        .select("*")
        .ilike("tap_url", `%${slug}`)
        .single();

      if (error) return NextResponse.json({ error: "Tag not found" }, { status: 404 });
      return NextResponse.json({ tag: data });
    }

    const { data, error } = await supabase
      .from("tags")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) return NextResponse.json({ error: "Failed to fetch tags" }, { status: 500 });
    return NextResponse.json({ tags: data });
  } catch {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
