import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { google } from "googleapis";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Route: Fetch user's last X emails
app.post("/fetch-emails", async (req, res) => {
  try {
    const { access_token, numEmails = 15 } = req.body;
    if (!access_token) {
      return res.status(400).json({ error: "Missing access token" });
    }

    // Create an OAuth2 client and set credentials
    const oauth2Client = new google.auth.OAuth2();
    oauth2Client.setCredentials({ access_token });

    const gmail = google.gmail({ version: "v1", auth: oauth2Client });

    // Fetch message list
    const messagesResponse = await gmail.users.messages.list({
      userId: "me",
      maxResults: numEmails,
    });

    const messages = messagesResponse.data.messages || [];
    const emailDetails = [];

    // Fetch full message data
    for (const msg of messages) {
      const msgData = await gmail.users.messages.get({
        userId: "me",
        id: msg.id,
      });

      const headers = msgData.data.payload.headers;
      const subject = headers.find((h) => h.name === "Subject")?.value || "(No Subject)";
      const from = headers.find((h) => h.name === "From")?.value || "(Unknown Sender)";
      const snippet = msgData.data.snippet || "";

      emailDetails.push({ subject, from, snippet });
    }

    res.json({ emails: emailDetails });
  } catch (err) {
    console.error("Error fetching emails:", err);
    res.status(500).json({ error: "Failed to fetch emails" });
  }
});

// ✅ Root route
app.get("/", (req, res) => {
  res.send("Server is running 🚀");
});

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
