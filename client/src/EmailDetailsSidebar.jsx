export default function EmailDetailsSidebar({ email, onClose }) {
  return (
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "rgba(0,0,0,0.3)",
          zIndex: 999,
        }}
      ></div>

      {/* Sidebar */}
      <div
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          width: "50%",
          height: "100%",
          background: "white",
          boxShadow: "-2px 0 8px rgba(0,0,0,0.2)",
          padding: "2rem",
          overflowY: "auto",
          zIndex: 1000,
          animation: "slideIn 0.3s ease-out",
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: "1rem",
            right: "1rem",
            background: "transparent",
            border: "none",
            fontSize: "1.2rem",
            cursor: "pointer",
          }}
        >
          ✖
        </button>

        <h2>{email.subject}</h2>
        <p>
          <strong>From:</strong> {email.from}
        </p>
        <p>
          <strong>To:</strong> {email.to}
        </p>
        <p>
          <strong>Date:</strong> {email.date}
        </p>
        {email.category && (
          <p style={{ color: "#007bff" }}>
            <strong>Category:</strong> {email.category}
          </p>
        )}
        <hr />
        <div
          style={{ marginTop: "1rem" }}
          dangerouslySetInnerHTML={{ __html: email.body || "<p>(No content)</p>" }}
        />
      </div>

      <style>
        {`
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `}
      </style>
    </>
  );
}
