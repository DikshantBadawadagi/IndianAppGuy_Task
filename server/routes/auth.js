import express from "express";
import { google } from "googleapis";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

// Step 1: Create OAuth2 client
const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

// Step 2: Define the scopes we need (Gmail + profile info)
const SCOPES = [
  "https://www.googleapis.com/auth/userinfo.profile",
  "https://www.googleapis.com/auth/userinfo.email",
  "https://www.googleapis.com/auth/gmail.readonly"
];

// Step 3: Route to start OAuth flow
router.get("/google", (req, res) => {
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: "offline",
    prompt: "consent",
    scope: SCOPES,
  });
  res.redirect(authUrl);
});

// Step 4: Callback route (Google redirects here after login)
router.get("/google/callback", async (req, res) => {
  const code = req.query.code;

  if (!code) {
    return res.status(400).json({ error: "Authorization code missing" });
  }

  try {
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    // Decode user info
    const oauth2 = google.oauth2({ version: "v2", auth: oauth2Client });
    const { data } = await oauth2.userinfo.get();

    // Redirect back to frontend with tokens and user info as query params (for simplicity)
    const redirectURL = `http://localhost:5173?access_token=${tokens.access_token}&email=${encodeURIComponent(data.email)}&name=${encodeURIComponent(data.name)}`;
    res.redirect(redirectURL);

  } catch (err) {
    console.error("Error exchanging code for tokens:", err);
    res.status(500).json({ error: "Failed to authenticate user" });
  }
});

export default router;
