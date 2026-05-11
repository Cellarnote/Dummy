import { createClient } from "@supabase/supabase-js";
import TapExperience from "./tap-experience";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

async function getTagData(slug: string) {
  const { data: tag, error } = await supabase
    .from("tags")
    .select("*")
    .ilike("tap_url", `%${slug}`)
    .single();

  if (error || !tag) return null;
  return { tag };
}

export default async function TapPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const data = await getTagData(slug);

  if (!data) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f4f5f7", fontFamily: "'Inter', sans-serif" }}>
        <div style={{ textAlign: "center", padding: "24px" }}>
          <div style={{ fontSize: "14px", color: "#6b7280", marginBottom: "8px" }}>This tag could not be found.</div>
          <div style={{ fontSize: "12px", color: "#9ca3af", fontWeight: 300 }}>It may have been deactivated or the URL is incorrect.</div>
        </div>
      </div>
    );
  }

  return <TapExperience tag={data.tag} />;
}
