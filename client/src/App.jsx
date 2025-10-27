import { useEffect, useState } from "react";

function App() {
  const [user, setUser] = useState(null);
  const [apiKey, setApiKey] = useState("");
  const [keySaved, setKeySaved] = useState(false);

  const CLIENT_ID = "589398350110-4shdn7nhgtcqsev0m837r8ml1v17bh13.apps.googleusercontent.com";
  const REDIRECT_URI = "http://localhost:5173";

  // ✅ STEP 1: Parse access_token from URL hash after redirect
  useEffect(() => {
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const accessToken = hashParams.get("access_token");

    if (accessToken) {
      localStorage.setItem("access_token", accessToken);
      window.location.hash = ""; // clean URL
    }

    const token = localStorage.getItem("access_token");
    if (token && !user) {
      // Fetch user info
      fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => {
          const userData = {
            access_token: token,
            email: data.email,
            name: data.name,
            picture: data.picture,
          };
          localStorage.setItem("user", JSON.stringify(userData));
          setUser(userData);
        })
        .catch((err) => console.error("Error fetching user info:", err));
    } else {
      const savedUser = localStorage.getItem("user");
      if (savedUser) setUser(JSON.parse(savedUser));
    }

    // Load OpenAI key
    const savedKey = localStorage.getItem("openai_api_key");
    if (savedKey) {
      setApiKey(savedKey);
      setKeySaved(true);
    }
  }, []);

  // ✅ STEP 2: Login via Google OAuth redirect
  const handleLogin = () => {
    const scope = encodeURIComponent(
      "https://www.googleapis.com/auth/gmail.readonly https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile openid"
    );
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=token&scope=${scope}`;
    window.location.href = authUrl;
  };

  // ✅ STEP 3: Logout
  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");
    setUser(null);
  };

  // ✅ STEP 4: Manage OpenAI key
  const handleSaveKey = () => {
    if (apiKey.trim()) {
      localStorage.setItem("openai_api_key", apiKey.trim());
      setKeySaved(true);
      alert("API key saved successfully!");
    }
  };

  const handleRemoveKey = () => {
    localStorage.removeItem("openai_api_key");
    setApiKey("");
    setKeySaved(false);
  };

  // ✅ STEP 5: Fetch emails from backend
  const fetchEmails = async () => {
    const res = await fetch("http://localhost:5000/fetch-emails", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        access_token: user.access_token,
        numEmails: 15,
      }),
    });

    const data = await res.json();
    console.log("Fetched emails:", data.emails);

    if (data.emails) {
      localStorage.setItem("emails", JSON.stringify(data.emails));
      alert(`Fetched ${data.emails.length} emails!`);
    } else {
      alert("Failed to fetch emails");
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "4rem", fontFamily: "sans-serif" }}>
      <h1>📧 Gmail Classifier</h1>

      {!user ? (
        <button
          onClick={handleLogin}
          style={{
            padding: "10px 20px",
            fontSize: "16px",
            cursor: "pointer",
            borderRadius: "6px",
          }}
        >
          Login with Google
        </button>
      ) : (
        <div>
          <h3>Welcome, {user.name} 👋</h3>
          <p>{user.email}</p>
          {user.picture && (
            <img
              src={user.picture}
              alt="Profile"
              style={{ borderRadius: "50%", width: "80px", marginBottom: "10px" }}
            />
          )}

          <button onClick={fetchEmails}>Fetch My Emails</button>

          {/* --- OpenAI Key Section --- */}
          <div
            style={{
              marginTop: "2rem",
              display: "inline-block",
              textAlign: "left",
              background: "#f9f9f9",
              padding: "20px",
              borderRadius: "10px",
              boxShadow: "0 0 10px rgba(0,0,0,0.1)",
            }}
          >
            <h4>🔑 OpenAI API Key</h4>
            {!keySaved ? (
              <div>
                <input
                  type="text"
                  placeholder="Enter your OpenAI API key"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  style={{
                    width: "300px",
                    padding: "8px",
                    borderRadius: "5px",
                    border: "1px solid #ccc",
                  }}
                />
                <button
                  onClick={handleSaveKey}
                  style={{
                    marginLeft: "10px",
                    padding: "8px 12px",
                    borderRadius: "5px",
                    border: "none",
                    backgroundColor: "#007bff",
                    color: "white",
                    cursor: "pointer",
                  }}
                >
                  Save
                </button>
              </div>
            ) : (
              <div>
                <p>
                  ✅ API Key saved: <strong>sk-********</strong>
                </p>
                <button
                  onClick={handleRemoveKey}
                  style={{
                    padding: "6px 10px",
                    borderRadius: "5px",
                    border: "none",
                    backgroundColor: "#dc3545",
                    color: "white",
                    cursor: "pointer",
                  }}
                >
                  Remove Key
                </button>
              </div>
            )}
          </div>

          <div style={{ marginTop: "2rem" }}>
            <button
              onClick={handleLogout}
              style={{
                padding: "8px 16px",
                fontSize: "14px",
                cursor: "pointer",
                borderRadius: "6px",
              }}
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
