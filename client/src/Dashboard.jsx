// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";

// export default function Dashboard() {
//   const [classifiedEmails, setClassifiedEmails] = useState([]);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const data = localStorage.getItem("classifiedEmails");
//     if (data) {
//       setClassifiedEmails(JSON.parse(data));
//     } else {
//       alert("No classified emails found. Please classify first!");
//       navigate("/emails");
//     }
//   }, [navigate]);

//   // Extract unique categories
//   const categories = [...new Set(classifiedEmails.map((e) => e.category))];

//   return (
//     <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
//       <h2>📊 Email Dashboard</h2>
//       <button
//         onClick={() => navigate("/emails")}
//         style={{
//           marginBottom: "1rem",
//           padding: "8px 16px",
//           borderRadius: "6px",
//           cursor: "pointer",
//         }}
//       >
//         ← Back to Emails
//       </button>

//       {categories.length === 0 ? (
//         <p>No categories found.</p>
//       ) : (
//         <div
//           style={{
//             display: "grid",
//             gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
//             gap: "1.5rem",
//           }}
//         >
//           {categories.map((cat) => (
//             <div
//               key={cat}
//               style={{
//                 background: "#f9f9f9",
//                 borderRadius: "10px",
//                 boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
//                 padding: "1rem",
//               }}
//             >
//               <h3 style={{ color: "#007bff" }}>{cat}</h3>
//               {classifiedEmails
//                 .filter((e) => e.category === cat)
//                 .map((email, i) => (
//                   <div
//                     key={i}
//                     style={{
//                       marginTop: "0.8rem",
//                       padding: "0.5rem",
//                       borderBottom: "1px solid #ddd",
//                     }}
//                   >
//                     <h4>{email.subject}</h4>
//                     <p>
//                       <strong>From:</strong> {email.from}
//                     </p>
//                     <p>{email.snippet}</p>
//                   </div>
//                 ))}
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }


// src/Dashboard.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getClassifiedEmails } from "./storageHelpers";

export default function Dashboard() {
  const [classifiedEmails, setClassifiedEmails] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const data = getClassifiedEmails();
    if (data.length > 0) {
      setClassifiedEmails(data);
    } else {
      alert("No classified emails found. Please classify first!");
      navigate("/emails");
    }
  }, [navigate]);

  const categories = [...new Set(classifiedEmails.map((e) => e.category))];

  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h2>📊 Email Dashboard</h2>
      <button
        onClick={() => navigate("/emails")}
        style={{
          marginBottom: "1rem",
          padding: "8px 16px",
          borderRadius: "6px",
          cursor: "pointer",
        }}
      >
        ← Back to Emails
      </button>

      {categories.length === 0 ? (
        <p>No categories found.</p>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "1.5rem",
          }}
        >
          {categories.map((cat) => (
            <div
              key={cat}
              style={{
                background: "#f9f9f9",
                borderRadius: "10px",
                boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                padding: "1rem",
              }}
            >
              <h3 style={{ color: "#007bff" }}>{cat}</h3>
              {classifiedEmails
                .filter((e) => e.category === cat)
                .map((email, i) => (
                  <div
                    key={i}
                    style={{
                      marginTop: "0.8rem",
                      padding: "0.5rem",
                      borderBottom: "1px solid #ddd",
                    }}
                  >
                    <h4>{email.subject}</h4>
                    <p>
                      <strong>From:</strong> {email.from}
                    </p>
                    <p>{email.snippet}</p>
                  </div>
                ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
