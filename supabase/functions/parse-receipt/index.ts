// Supabase Edge Function: parse-receipt
// Receives a receipt image (base64) + the current materials list,
// asks Claude to extract material names + grams received, returns parsed JSON.
//
// Required Supabase secret: ANTHROPIC_API_KEY
// Deploy: `supabase functions deploy parse-receipt`

import Anthropic from "npm:@anthropic-ai/sdk@0.39.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

interface ParsedItem {
  material_name: string;
  matched_material_id: string | null;
  grams_received: number | null;
  raw_text: string;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { imageBase64, mimeType, materials } = await req.json() as {
      imageBase64: string;
      mimeType: string;
      materials: Array<{ id: string; name: string }>;
    };

    if (!imageBase64 || !mimeType || !Array.isArray(materials)) {
      return json({ error: "Missing imageBase64, mimeType, or materials" }, 400);
    }

    const apiKey = Deno.env.get("ANTHROPIC_API_KEY");
    if (!apiKey) return json({ error: "ANTHROPIC_API_KEY not configured" }, 500);

    const anthropic = new Anthropic({ apiKey });

    const materialsList = materials.map((m) => `- ${m.name} (id: ${m.id})`).join("\n");

    const prompt = `אתה עוזר לקרמיקאית בעברית לקרוא קבלות של חומרי גלם.

הקבלה בתמונה רשומה בעברית (לרוב). חלץ ממנה את החומרים שהתקבלו ואת המשקל בגרמים.

רשימת החומרים הקיימים במחסן (מתוכם בחר התאמה):
${materialsList}

החזר JSON תקין בלבד (ללא טקסט נוסף, ללא markdown), בפורמט הבא:
{
  "items": [
    {
      "material_name": "השם כפי שמופיע בקבלה",
      "matched_material_id": "ה-id מהרשימה למעלה אם זוהתה התאמה, אחרת null",
      "grams_received": 1500,
      "raw_text": "השורה המקורית מהקבלה"
    }
  ]
}

הוראות:
- grams_received: תמיד בגרמים (המר ק"ג ל-1000 גרם, טון ל-1,000,000)
- אם הכמות לא ברורה - grams_received: null
- matched_material_id: התאמה מדויקת או דומה מאוד (למשל "פלדספר נתרני" = "פלדספר נתרני"); בספק - null
- אם פריט בקבלה אינו חומר גלם (משלוח, מע"מ, סה"כ) - אל תכלול אותו
- אם התמונה לא קריאה או לא קבלה - החזר {"items": []}
`;

    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 2048,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image",
              source: {
                type: "base64",
                media_type: mimeType as "image/jpeg" | "image/png" | "image/webp" | "image/gif",
                data: imageBase64,
              },
            },
            { type: "text", text: prompt },
          ],
        },
      ],
    });

    const textBlock = response.content.find((b) => b.type === "text");
    if (!textBlock || textBlock.type !== "text") {
      return json({ error: "No text in Claude response" }, 502);
    }

    const jsonMatch = textBlock.text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return json({ error: "No JSON in Claude response", raw: textBlock.text }, 502);

    const parsed = JSON.parse(jsonMatch[0]) as { items: ParsedItem[] };

    return json({
      items: parsed.items ?? [],
      usage: response.usage,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return json({ error: message }, 500);
  }
});

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
