// export async function askGemini(prompt: string) {
//   const apiKey = process.env.GEMINI_API_KEY;
//   const url =
//     "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=" + apiKey;

//   const res = await fetch(url, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({
//       contents: [{ parts: [{ text: prompt }] }],
//     }),
//   });

//   const data = await res.json();

//   // (แนะนำให้ log ดูตอนเทส)
//   // console.log("Gemini Response:", JSON.stringify(data));

//   return data?.candidates?.[0]?.content?.parts?.[0]?.text || "ขออภัย ตอบไม่ได้";
// }

export async function askGemini(prompt: string) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error("GEMINI_API_KEY is missing");

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
      }),
    });

    const data = await res.json();

    return data?.candidates?.[0]?.content?.parts?.[0]?.text || "ขออภัย ตอบไม่ได้";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "เกิดข้อผิดพลาดในการเชื่อมต่อกับแชทบอท";
  }
}
