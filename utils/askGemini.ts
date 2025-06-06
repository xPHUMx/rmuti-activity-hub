export async function askGemini(prompt: string) {
  const apiKey = process.env.GEMINI_API_KEY;
  const url =
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=" + apiKey;

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
    }),
  });

  const data = await res.json();

  // (แนะนำให้ log ดูตอนเทส)
  // console.log("Gemini Response:", JSON.stringify(data));

  return data?.candidates?.[0]?.content?.parts?.[0]?.text || "ขออภัย ตอบไม่ได้";
}
