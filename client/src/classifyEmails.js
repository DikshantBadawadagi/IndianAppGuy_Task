export default async function classifyEmails(emails, apiKey) {
  const prompt = `
You are an AI email classifier. Classify each email into one of these categories:
Important, Promotions, Social, Marketing, Spam, or General.

Rules:
- Important: Personal/work emails requiring attention.
- Promotions: Sales, discounts, offers.
- Social: From social media, friends, family.
- Marketing: Newsletters, brand updates.
- Spam: Unwanted or phishing emails.
- General: Anything else.

Respond in pure JSON only. No code blocks, no explanations.
Format:
[
  { "subject": "Email subject", "category": "Important" },
  ...
]

Here are the emails:
${emails
  .map(
    (e, i) =>
      `Email ${i + 1}:\nSubject: ${e.subject}\nFrom: ${e.from}\nSnippet: ${e.snippet}\n`
  )
  .join("\n")}
`;

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are a precise email classifier." },
        { role: "user", content: prompt },
      ],
      temperature: 0,
    }),
  });

  const data = await response.json();
  let text = data.choices?.[0]?.message?.content?.trim();

  // 🧹 Clean up possible markdown code block
  if (text.startsWith("```")) {
    text = text.replace(/```json/i, "").replace(/```/g, "").trim();
  }

  try {
    const parsed = JSON.parse(text);
    return parsed.map((item) => item.category);
  } catch (err) {
    console.error("Failed to parse response:", text);
    throw new Error("Invalid JSON from OpenAI");
  }
}