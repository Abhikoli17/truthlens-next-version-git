export async function extractClaim(input: { title: string; description?: string | null; content?: string | null }) {
  const text = [input.title, input.description || "", input.content || ""]
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return heuristicClaim(input.title, input.description || undefined);
  }

  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || "gpt-4o-mini",
        temperature: 0.1,
        messages: [
          {
            role: "system",
            content: "Extract one short factual claim from a news headline/article. Return only the claim in one sentence with no markdown."
          },
          {
            role: "user",
            content: text.slice(0, 5000)
          }
        ]
      })
    });

    if (!res.ok) {
      return heuristicClaim(input.title, input.description || undefined);
    }

    const data = await res.json();
    const claim = data?.choices?.[0]?.message?.content?.trim();
    return claim || heuristicClaim(input.title, input.description || undefined);
  } catch {
    return heuristicClaim(input.title, input.description || undefined);
  }
}

function heuristicClaim(title: string, description?: string) {
  const base = `${title} ${description || ""}`.replace(/\s+/g, " ").trim();
  return base.split(/[.!?]/)[0]?.trim() || title;
}
