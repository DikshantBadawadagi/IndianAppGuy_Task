// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import classifyEmails from "./classifyEmails";

// export default function EmailsPage() {
//   const [emails, setEmails] = useState([]);
//   const [selectedK, setSelectedK] = useState(5);
//   const [maxEmails, setMaxEmails] = useState(15);
//   const [classifiedEmails, setClassifiedEmails] = useState([]);
//   const [selectedCategory, setSelectedCategory] = useState("");
//   const [isClassifying, setIsClassifying] = useState(false);
//   const [classified, setClassified] = useState(false);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const storedEmails = localStorage.getItem("emails");
//     if (storedEmails) {
//       setEmails(JSON.parse(storedEmails));
//     } else {
//       navigate("/");
//     }
//   }, [navigate]);

//   const handleClassify = async () => {
//     const apiKey = localStorage.getItem("openai_api_key");
//     if (!apiKey) {
//       alert("Please save your OpenAI API key first!");
//       return;
//     }

//     setIsClassifying(true);
//     try {
//       const topEmails = emails.slice(0, selectedK);
//       const categories = await classifyEmails(topEmails, apiKey);

//       const classifiedData = topEmails.map((email, i) => ({
//         ...email,
//         category: categories[i] || "General",
//       }));

//       setClassifiedEmails(classifiedData);
//       setClassified(true);
//       localStorage.setItem("classifiedEmails", JSON.stringify(classifiedData));
//       alert("✅ Classification complete!");
//     } catch (err) {
//       console.error("Error classifying emails:", err);
//       alert("Failed to classify emails.");
//     } finally {
//       setIsClassifying(false);
//     }
//   };

//   // Handle invalid X input gracefully
//   const handleMaxEmailsChange = (e) => {
//     const val = parseInt(e.target.value);
//     if (!val || val < 1) {
//       setMaxEmails(1);
//       return;
//     }
//     // Limit to total number of fetched emails
//     const safeValue = Math.min(val, emails.length || 1);
//     setMaxEmails(safeValue);
//     if (selectedK > safeValue) setSelectedK(safeValue);
//   };

//   // Filter logic
//   const displayedEmails =
//     classified && selectedCategory
//       ? classifiedEmails.filter((e) => e.category === selectedCategory)
//       : classified
//       ? classifiedEmails
//       : emails.slice(0, maxEmails);

//   return (
//     <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
//       <h2>📬 Your Latest Emails</h2>
//       <button
//         onClick={() => navigate("/")}
//         style={{
//           marginBottom: "1rem",
//           padding: "8px 16px",
//           borderRadius: "6px",
//           cursor: "pointer",
//         }}
//       >
//         ← Back
//       </button>

//       {/* Controls */}
//       <div
//         style={{
//           display: "flex",
//           alignItems: "center",
//           gap: "1rem",
//           marginBottom: "1.5rem",
//           flexWrap: "wrap",
//         }}
//       >
//         {/* X input */}
//         <label>
//           <strong>Show top X emails:</strong>
//         </label>
//         <input
//           type="number"
//           value={maxEmails}
//           min={1}
//           onChange={handleMaxEmailsChange}
//           style={{
//             width: "70px",
//             padding: "6px 8px",
//             borderRadius: "6px",
//             border: "1px solid #ccc",
//           }}
//         />

//         {/* K selector */}
//         <label>
//           <strong>Select K for classification:</strong>
//         </label>
//         <select
//           value={selectedK}
//           onChange={(e) => setSelectedK(parseInt(e.target.value))}
//           style={{
//             padding: "6px 10px",
//             borderRadius: "6px",
//             border: "1px solid #ccc",
//           }}
//         >
//           {[...Array(Math.min(maxEmails, emails.length || 1))].map((_, i) => (
//             <option key={i + 1} value={i + 1}>
//               {i + 1}
//             </option>
//           ))}
//         </select>

//         <button
//           onClick={handleClassify}
//           disabled={isClassifying}
//           style={{
//             padding: "8px 16px",
//             borderRadius: "6px",
//             cursor: "pointer",
//             backgroundColor: isClassifying ? "#ccc" : "#007bff",
//             color: "white",
//             border: "none",
//           }}
//         >
//           {isClassifying ? "Classifying..." : "Classify"}
//         </button>

//         {/* Category filter */}
//         <select
//           disabled={!classified}
//           value={selectedCategory}
//           onChange={(e) => setSelectedCategory(e.target.value)}
//           style={{
//             padding: "6px 10px",
//             borderRadius: "6px",
//             border: "1px solid #ccc",
//             backgroundColor: classified ? "white" : "#f0f0f0",
//             cursor: classified ? "pointer" : "not-allowed",
//           }}
//         >
//           <option value="">-- Filter by Category --</option>
//           <option value="Important">Important</option>
//           <option value="Promotions">Promotions</option>
//           <option value="Social">Social</option>
//           <option value="Marketing">Marketing</option>
//           <option value="Spam">Spam</option>
//           <option value="General">General</option>
//         </select>

//         {/* Dashboard */}
//         <button
//           onClick={() => navigate("/dashboard")}
//           disabled={!classified}
//           style={{
//             padding: "8px 16px",
//             borderRadius: "6px",
//             backgroundColor: classified ? "#28a745" : "#ccc",
//             color: "white",
//             border: "none",
//             cursor: classified ? "pointer" : "not-allowed",
//           }}
//         >
//           📊 Go to Dashboard
//         </button>
//       </div>

//       {/* Email Cards */}
//       {displayedEmails.length === 0 ? (
//         <p>No emails found.</p>
//       ) : (
//         <div style={{ display: "grid", gap: "1rem" }}>
//           {displayedEmails.map((email, index) => (
//             <div
//               key={index}
//               style={{
//                 border: "1px solid #ddd",
//                 borderRadius: "8px",
//                 padding: "1rem",
//                 background: "#fafafa",
//               }}
//             >
//               <h4>{email.subject}</h4>
//               <p>
//                 <strong>From:</strong> {email.from}
//               </p>
//               <p>{email.snippet}</p>
//               {classified && (
//                 <p style={{ color: "#007bff" }}>
//                   <strong>Category:</strong> {email.category}
//                 </p>
//               )}
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }

// src/EmailsPage.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import classifyEmails from "./classifyEmails";
import {
  getStoredEmails,
  getClassifiedEmails,
  saveClassifiedEmails,
} from "./storageHelpers";

export default function EmailsPage() {
  const [emails, setEmails] = useState([]);
  const [selectedK, setSelectedK] = useState(5);
  const [maxEmails, setMaxEmails] = useState(15);
  const [classifiedEmails, setClassifiedEmails] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [isClassifying, setIsClassifying] = useState(false);
  const [classified, setClassified] = useState(false);
  const navigate = useNavigate();

  // Load cached emails and classifications
  useEffect(() => {
    const storedEmails = getStoredEmails();
    if (storedEmails.length > 0) {
      setEmails(storedEmails);

      const cachedClassified = getClassifiedEmails();
      if (cachedClassified.length > 0) {
        setClassifiedEmails(cachedClassified);
        setClassified(true);
      }
    } else {
      navigate("/");
    }
  }, [navigate]);

  const handleClassify = async () => {
    const apiKey = localStorage.getItem("openai_api_key");
    if (!apiKey) {
      alert("Please save your OpenAI API key first!");
      return;
    }

    // check if already cached
    const cached = getClassifiedEmails();
    if (cached.length > 0) {
      if (
        window.confirm(
          "Cached classifications found. Do you want to reclassify anyway?"
        )
      ) {
        // continue classification
      } else {
        setClassifiedEmails(cached);
        setClassified(true);
        return;
      }
    }

    setIsClassifying(true);
    try {
      const topEmails = emails.slice(0, selectedK);
      const classifiedData = await classifyEmails(topEmails, apiKey);

      saveClassifiedEmails(classifiedData);
      setClassifiedEmails(classifiedData);
      setClassified(true);

      alert("✅ Classification complete and cached!");
    } catch (err) {
      console.error("Error classifying emails:", err);
      alert("Failed to classify emails.");
    } finally {
      setIsClassifying(false);
    }
  };

  // Handle invalid X input gracefully
  const handleMaxEmailsChange = (e) => {
    const val = parseInt(e.target.value);
    if (!val || val < 1) {
      setMaxEmails(1);
      return;
    }
    const safeValue = Math.min(val, emails.length || 1);
    setMaxEmails(safeValue);
    if (selectedK > safeValue) setSelectedK(safeValue);
  };

  // Filter logic
  const displayedEmails =
    classified && selectedCategory
      ? classifiedEmails.filter((e) => e.category === selectedCategory)
      : classified
      ? classifiedEmails
      : emails.slice(0, maxEmails);

  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h2>📬 Your Latest Emails</h2>
      <button
        onClick={() => navigate("/")}
        style={{
          marginBottom: "1rem",
          padding: "8px 16px",
          borderRadius: "6px",
          cursor: "pointer",
        }}
      >
        ← Back
      </button>

      {/* Controls */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "1rem",
          marginBottom: "1.5rem",
          flexWrap: "wrap",
        }}
      >
        {/* X input */}
        <label>
          <strong>Show top X emails:</strong>
        </label>
        <input
          type="number"
          value={maxEmails}
          min={1}
          onChange={handleMaxEmailsChange}
          style={{
            width: "70px",
            padding: "6px 8px",
            borderRadius: "6px",
            border: "1px solid #ccc",
          }}
        />

        {/* K selector */}
        <label>
          <strong>Select K for classification:</strong>
        </label>
        <select
          value={selectedK}
          onChange={(e) => setSelectedK(parseInt(e.target.value))}
          style={{
            padding: "6px 10px",
            borderRadius: "6px",
            border: "1px solid #ccc",
          }}
        >
          {[...Array(Math.min(maxEmails, emails.length || 1))].map((_, i) => (
            <option key={i + 1} value={i + 1}>
              {i + 1}
            </option>
          ))}
        </select>

        <button
          onClick={handleClassify}
          disabled={isClassifying}
          style={{
            padding: "8px 16px",
            borderRadius: "6px",
            cursor: "pointer",
            backgroundColor: isClassifying ? "#ccc" : "#007bff",
            color: "white",
            border: "none",
          }}
        >
          {isClassifying ? "Classifying..." : "Classify"}
        </button>

        {/* Category filter */}
        <select
          disabled={!classified}
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          style={{
            padding: "6px 10px",
            borderRadius: "6px",
            border: "1px solid #ccc",
            backgroundColor: classified ? "white" : "#f0f0f0",
            cursor: classified ? "pointer" : "not-allowed",
          }}
        >
          <option value="">-- Filter by Category --</option>
          <option value="Important">Important</option>
          <option value="Promotions">Promotions</option>
          <option value="Social">Social</option>
          <option value="Marketing">Marketing</option>
          <option value="Spam">Spam</option>
          <option value="General">General</option>
        </select>

        {/* Dashboard */}
        <button
          onClick={() => navigate("/dashboard")}
          disabled={!classified}
          style={{
            padding: "8px 16px",
            borderRadius: "6px",
            backgroundColor: classified ? "#28a745" : "#ccc",
            color: "white",
            border: "none",
            cursor: classified ? "pointer" : "not-allowed",
          }}
        >
          📊 Go to Dashboard
        </button>
      </div>

      {/* Email Cards */}
      {displayedEmails.length === 0 ? (
        <p>No emails found.</p>
      ) : (
        <div style={{ display: "grid", gap: "1rem" }}>
          {displayedEmails.map((email, index) => (
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
              {classified && (
                <p style={{ color: "#007bff" }}>
                  <strong>Category:</strong> {email.category}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
