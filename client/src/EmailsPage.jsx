import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import classifyEmails from "./classifyEmails";

export default function EmailsPage() {
  const [emails, setEmails] = useState([]);
  const [k, setK] = useState(5);
  const [classifiedEmails, setClassifiedEmails] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const storedEmails = localStorage.getItem("emails");
    if (storedEmails) {
      setEmails(JSON.parse(storedEmails));
    } else {
      navigate("/");
    }
  }, [navigate]);

  const handleClassify = async () => {
    const apiKey = localStorage.getItem("openai_api_key");
    if (!apiKey) {
      alert("Please save your OpenAI API key on the home page first!");
      return;
    }

    setLoading(true);
    try {
      const topKEmails = emails.slice(0, k);
      const results = await classifyEmails(topKEmails, apiKey);
      setClassifiedEmails(results);
    } catch (error) {
      console.error("Error classifying emails:", error);
      alert("Failed to classify emails. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
        <button
          onClick={() => navigate("/")}
          style={{
            padding: "8px 16px",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          ← Back
        </button>

        <div>
          <label>Select Top K Emails: </label>
          <select
            value={k}
            onChange={(e) => setK(Number(e.target.value))}
            style={{ padding: "6px", borderRadius: "5px" }}
          >
            {[...Array(15)].map((_, i) => (
              <option key={i + 1} value={i + 1}>
                {i + 1}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={handleClassify}
          disabled={loading}
          style={{
            padding: "8px 16px",
            borderRadius: "6px",
            backgroundColor: "#007bff",
            color: "white",
            cursor: "pointer",
            border: "none",
          }}
        >
          {loading ? "Classifying..." : "Classify"}
        </button>
      </div>

      <h2 style={{ marginTop: "1.5rem" }}>📬 Your Latest Emails</h2>

      {emails.length === 0 ? (
        <p>No emails found.</p>
      ) : (
        <div style={{ display: "grid", gap: "1rem", marginTop: "1rem" }}>
          {emails.map((email, index) => {
            const classification = classifiedEmails[index];
            return (
              <div
                key={index}
                style={{
                  border: "1px solid #ddd",
                  borderRadius: "8px",
                  padding: "1rem",
                  background: "#fafafa",
                }}
              >
                <h4>{email.subject}</h4>
                <p>
                  <strong>From:</strong> {email.from}
                </p>
                <p>{email.snippet}</p>

                {classification && (
                  <p>
                    <strong>📂 Category:</strong>{" "}
                    <span
                      style={{
                        color:
                          classification === "Important"
                            ? "green"
                            : classification === "Spam"
                            ? "red"
                            : "#007bff",
                      }}
                    >
                      {classification}
                    </span>
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
