import { createClient } from "@supabase/supabase-js";
import TapExperience from "./tap-experience";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

async function getCardData(slug: string) {
  const { data: card } = await supabase
    .from("cards")
    .select("*, customers(first_name, last_name)")
    .eq("slug", slug)
    .maybeSingle();

  return card ?? null;
}

export default async function TapPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const card = await getCardData(slug);

  if (!card) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f9fafb", fontFamily: "'Inter', sans-serif" }}>
        <div style={{ textAlign: "center", padding: "24px" }}>
          <div style={{ fontSize: "14px", color: "#6b7280", marginBottom: "8px" }}>Service card not found.</div>
          <div style={{ fontSize: "12px", color: "#9ca3af", fontWeight: 300 }}>This link may be invalid or expired.</div>
        </div>
      </div>
    );
  }

  return <TapExperience card={card} />;
}
