export default async function classifyEmails(emails, apiKey) {
  const prompt = `You are an expert email classifier with deep understanding of email patterns, sender behavior, and content analysis. Classify each email into EXACTLY ONE of these categories: Important, Promotions, Social, Marketing, Spam, or General.

CRITICAL CLASSIFICATION RULES (Apply in this priority order):

1. SPAM (Highest Priority - Check First):
   - Suspicious sender domains (random characters, misspellings of known brands)
   - Phishing attempts (urgent account warnings, password resets you didn't request)
   - Get-rich-quick schemes, lottery winnings, inheritance claims
   - Requests for personal information or money transfers
   - Adult content, illegal products, counterfeit goods
   - Excessive caps, exclamation marks (!!!, FREE!!!, URGENT!!!)
   - Suspicious links or attachments mentioned
   - Sender mismatch (claims to be from Bank but email is @random-domain.com)
   - No legitimate unsubscribe option mentioned
   - Generic greetings like "Dear Customer" with urgent demands

2. IMPORTANT (Second Priority):
   Must meet MULTIPLE criteria:
   - From known work domains (@company.com, @organization.edu)
   - From colleagues, managers, or direct reports
   - Contains: meeting requests, deadlines, project updates, approvals needed
   - Personal emails from friends/family with time-sensitive matters
   - Financial institutions: transaction confirmations, security alerts (if legitimate domain)
   - Legal documents, contracts, official notices
   - Account security from verified services (password changes YOU initiated)
   - Healthcare appointments, prescriptions, test results
   - Travel confirmations (flights, hotels, rentals)
   - Package delivery updates from legitimate couriers
   
   EXCLUDE from Important:
   - Automated newsletters even if from work tools
   - Marketing emails even if personalized
   - Social media notifications

3. PROMOTIONS (Third Priority):
   - Clear sales intent with discount codes, limited-time offers
   - Subject contains: "% off", "Sale", "Deal", "Save", "Discount", "Coupon"
   - Retail/e-commerce promotional emails
   - Flash sales, clearance events, seasonal sales
   - "Shop now", "Limited time", "Exclusive offer" language
   - Price comparisons, product recommendations with buy buttons
   - Abandoned cart reminders
   - From known retail brands with commercial intent

4. SOCIAL (Fourth Priority):
   - From social networks: Facebook, LinkedIn, Twitter, Instagram, TikTok, etc.
   - Notifications about: comments, likes, shares, mentions, tags
   - Friend requests, connection requests, network updates
   - Group activity, event invitations from social platforms
   - Dating apps, community forums
   - Personal emails from friends/family WITHOUT urgency (casual catch-ups, updates)
   - Social gaming notifications
   
   EXCLUDE from Social:
   - Work-related LinkedIn messages (those are Important)
   - Urgent personal matters (those are Important)

5. MARKETING (Fifth Priority):
   - Newsletters from brands, publications, blogs
   - Company updates, product announcements, feature releases
   - Educational content, webinars, whitepapers
   - Brand storytelling without immediate sales pressure
   - Weekly/monthly digest emails
   - Survey requests, feedback forms
   - Content marketing, thought leadership
   - Event invitations (conferences, webinars) without tickets/sales
   - App update notifications, changelog emails
   - Non-promotional brand communications
   
   EXCLUDE from Marketing:
   - Direct sales/discounts (those are Promotions)
   - Spam-like mass emails

6. GENERAL (Last Resort):
   - Automated system notifications that don't fit above
   - Receipts and invoices (not Important unless action needed)
   - Subscription confirmations
   - Terms of service updates
   - Generic service announcements
   - Anything that doesn't clearly fit other categories

CLASSIFICATION DECISION PROCESS:
1. Check for SPAM indicators first - if multiple red flags, classify as Spam
2. Check for IMPORTANT criteria - must have strong work/personal urgency signals
3. Check for clear PROMOTIONAL intent - explicit sales/discounts
4. Check for SOCIAL platform origins
5. Check for MARKETING content patterns
6. Default to GENERAL only if nothing else fits

RESPONSE FORMAT (JSON only, no explanations):
[
  { "subject": "exact subject line", "category": "CategoryName" },
  ...
]

EMAILS TO CLASSIFY:
${emails
  .map(
    (e, i) =>
      `
Email ${i + 1}:
Subject: ${e.subject}
From: ${e.from}
Snippet: ${e.snippet}
---`
  )
  .join("\n")}

Return ONLY the JSON array. Be consistent - same email patterns should always get the same category.`;

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [
        { 
          role: "system", 
          content: "You are a professional email classifier that applies strict, consistent rules. You analyze sender domains, content patterns, and urgency signals to make accurate classifications. You never change your decision for the same email pattern." 
        },
        { role: "user", content: prompt },
      ],
      temperature: 0, 
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    }),
  });

  const data = await response.json();
  let text = data.choices?.[0]?.message?.content?.trim() || "";

  if (text.startsWith("```")) {
    text = text.replace(/```json/i, "").replace(/```/g, "").trim();
  }

  try {
    const parsed = JSON.parse(text);
    return emails.map((email, i) => ({
      ...email, 
      id: i,
      category: parsed[i]?.category || "General",
    }));
  } catch (err) {
    console.error("Failed to parse OpenAI response:", text);
    throw new Error("Invalid JSON returned from OpenAI");
  }
}