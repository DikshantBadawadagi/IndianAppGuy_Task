// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import classifyEmails from "./classifyEmails";
// import {
//   getStoredEmails,
//   getClassifiedEmails,
//   saveClassifiedEmails,
// } from "./storageHelpers";
// import EmailDetailsSidebar from "./EmailDetailsSidebar";

// export default function EmailsPage() {
//   const [emails, setEmails] = useState([]);
//   const [selectedK, setSelectedK] = useState(5);
//   const [maxEmails, setMaxEmails] = useState(15);
//   const [classifiedEmails, setClassifiedEmails] = useState([]);
//   const [selectedCategory, setSelectedCategory] = useState("");
//   const [isClassifying, setIsClassifying] = useState(false);
//   const [classified, setClassified] = useState(false);
//   const [selectedEmail, setSelectedEmail] = useState(null);
//   const navigate = useNavigate();

//   // Load cached emails and classifications
//   useEffect(() => {
//     const storedEmails = getStoredEmails();
//     if (storedEmails.length > 0) {
//       setEmails(storedEmails);

//       const cachedClassified = getClassifiedEmails();
//       if (cachedClassified.length > 0) {
//         setClassifiedEmails(cachedClassified);
//         setClassified(true);
//       }
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

//     // check if already cached
//     const cached = getClassifiedEmails();
//     if (cached.length > 0) {
//       if (
//         window.confirm(
//           "Cached classifications found. Do you want to reclassify anyway?"
//         )
//       ) {
//         // continue classification
//       } else {
//         setClassifiedEmails(cached);
//         setClassified(true);
//         return;
//       }
//     }

//     setIsClassifying(true);
//     try {
//       const topEmails = emails.slice(0, selectedK);
//       const classifiedData = await classifyEmails(topEmails, apiKey);

//       saveClassifiedEmails(classifiedData);
//       setClassifiedEmails(classifiedData);
//       setClassified(true);

//       alert("✅ Classification complete and cached!");
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
//     <div style={{ padding: "2rem", fontFamily: "sans-serif", position: "relative" }}>
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
//               onClick={() => setSelectedEmail(email)}
//               style={{
//                 border: "1px solid #ddd",
//                 borderRadius: "8px",
//                 padding: "1rem",
//                 background: "#fafafa",
//                 cursor: "pointer",
//                 transition: "background 0.2s",
//               }}
//               onMouseEnter={(e) => (e.currentTarget.style.background = "#f0f0f0")}
//               onMouseLeave={(e) => (e.currentTarget.style.background = "#fafafa")}
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

//       {/* Right Sidebar for Email Details */}
//       {selectedEmail && (
//         <EmailDetailsSidebar
//           email={selectedEmail}
//           onClose={() => setSelectedEmail(null)}
//         />
//       )}
//     </div>
//   );
// }

"use client"

import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import classifyEmails from "./classifyEmails"
import { getStoredEmails, getClassifiedEmails, saveClassifiedEmails } from "./storageHelpers"
import EmailDetailsSidebar from "./EmailDetailsSidebar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Mail, ArrowLeft, BarChart3, Zap, Loader2, Filter } from "lucide-react"
import Layout from "./Layout" 

export default function EmailsPage() {
  const [emails, setEmails] = useState([])
  const [selectedK, setSelectedK] = useState(5)
  const [maxEmails, setMaxEmails] = useState(15)
  const [classifiedEmails, setClassifiedEmails] = useState([])
  const [selectedCategory, setSelectedCategory] = useState("")
  const [isClassifying, setIsClassifying] = useState(false)
  const [classified, setClassified] = useState(false)
  const [selectedEmail, setSelectedEmail] = useState(null)
  const navigate = useNavigate()

  const [isLoaded, setIsLoaded] = useState(false)

  // Load cached emails and classifications
  useEffect(() => {
    const storedEmails = getStoredEmails()
    if (storedEmails.length > 0) {
      setEmails(storedEmails)

      const cachedClassified = getClassifiedEmails()
      if (cachedClassified.length > 0) {
        setClassifiedEmails(cachedClassified)
        setClassified(true)
      }
    } else {
      navigate("/")
    }
    setTimeout(() => setIsLoaded(true), 100)
  }, [navigate])

  const handleClassify = async () => {
    const apiKey = localStorage.getItem("openai_api_key")
    if (!apiKey) {
      alert("Please save your OpenAI API key first!")
      return
    }

    // check if already cached
    const cached = getClassifiedEmails()
    if (cached.length > 0) {
      if (window.confirm("Cached classifications found. Do you want to reclassify anyway?")) {
        // continue classification
      } else {
        setClassifiedEmails(cached)
        setClassified(true)
        return
      }
    }

    setIsClassifying(true)
    try {
      const topEmails = emails.slice(0, selectedK)
      const classifiedData = await classifyEmails(topEmails, apiKey)

      saveClassifiedEmails(classifiedData)
      setClassifiedEmails(classifiedData)
      setClassified(true)

      alert("✅ Classification complete and cached!")
    } catch (err) {
      console.error("Error classifying emails:", err)
      alert("Failed to classify emails.")
    } finally {
      setIsClassifying(false)
    }
  }

  // Handle invalid X input gracefully
  const handleMaxEmailsChange = (e) => {
    const val = Number.parseInt(e.target.value)
    if (!val || val < 1) {
      setMaxEmails(1)
      return
    }
    const safeValue = Math.min(val, emails.length || 1)
    setMaxEmails(safeValue)
    if (selectedK > safeValue) setSelectedK(safeValue)
  }

  // Filter logic
  const displayedEmails =
    classified && selectedCategory
      ? classifiedEmails.filter((e) => e.category === selectedCategory)
      : classified
        ? classifiedEmails
        : emails.slice(0, maxEmails)

  const categoryColors = {
    Important: "bg-red-500/20 text-red-400 border-red-500/30",
    Promotions: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    Social: "bg-purple-500/20 text-purple-400 border-purple-500/30",
    Marketing: "bg-orange-500/20 text-orange-400 border-orange-500/30",
    Spam: "bg-gray-500/20 text-gray-400 border-gray-500/30",
    General: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
  }

  return (
    <Layout user={JSON.parse(localStorage.getItem("user") || "{}")}>
      <div
        className={`min-h-[calc(100vh-120px)] bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6 transition-opacity duration-700 ${isLoaded ? "opacity-100" : "opacity-0"}`}
      >
        <div className="fixed inset-0 bg-gradient-to-t from-blue-500/5 via-transparent to-purple-500/5 pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8 animate-in fade-in slide-in-from-top-4 duration-500">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg">
                  <Mail className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-white">Email Classifier</h1>
                  <p className="text-slate-400 text-sm">Organize and categorize your emails with AI</p>
                </div>
              </div>
              <Button
                onClick={() => navigate("/")}
                variant="outline"
                className="border-slate-700 hover:bg-slate-800 text-slate-300 hover:text-white gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </Button>
            </div>
          </div>

          {/* Controls Card */}
          <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-sm mb-8 animate-in fade-in slide-in-from-top-4 duration-500 delay-100">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Zap className="w-5 h-5 text-yellow-400" />
                Classification Controls
              </CardTitle>
              <CardDescription className="text-slate-400">Configure and run email classification</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                {/* Max Emails Input */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">Show Top X Emails</label>
                  <Input
                    type="number"
                    value={maxEmails}
                    min={1}
                    onChange={handleMaxEmailsChange}
                    className="bg-slate-800 border-slate-700 text-white placeholder-slate-500 focus:border-blue-500 focus:ring-blue-500/20"
                  />
                </div>

                {/* K Selector */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">Select K for Classification</label>
                  <Select value={selectedK.toString()} onValueChange={(val) => setSelectedK(Number.parseInt(val))}>
                    <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700">
                      {[...Array(Math.min(maxEmails, emails.length || 1))].map((_, i) => (
                        <SelectItem key={i + 1} value={(i + 1).toString()} className="text-white hover:bg-slate-700">
                          {i + 1}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Classify Button */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">&nbsp;</label>
                  <Button
                    onClick={handleClassify}
                    disabled={isClassifying}
                    className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold gap-2 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20"
                  >
                    {isClassifying ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Classifying...
                      </>
                    ) : (
                      <>
                        <Zap className="w-4 h-4" />
                        Classify
                      </>
                    )}
                  </Button>
                </div>

                {/* Category Filter */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300 flex items-center gap-1">
                    <Filter className="w-4 h-4" />
                    Filter by Category
                  </label>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory} disabled={!classified}>
                    <SelectTrigger
                      className={`${!classified ? "opacity-50 cursor-not-allowed" : ""} bg-slate-800 border-slate-700 text-white`}
                    >
                      <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700">
                      <SelectItem value="all" className="text-white hover:bg-slate-700">
                        All Categories
                      </SelectItem>
                      {["Important", "Promotions", "Social", "Marketing", "Spam", "General"].map((cat) => (
                        <SelectItem key={cat} value={cat} className="text-white hover:bg-slate-700">
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Dashboard Button */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">&nbsp;</label>
                  <Button
                    onClick={() => navigate("/dashboard")}
                    disabled={!classified}
                    className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold gap-2 transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <BarChart3 className="w-4 h-4" />
                    Dashboard
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Email List */}
          <div className="space-y-3 animate-in fade-in duration-500 delay-200">
            {displayedEmails.length === 0 ? (
              <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-sm">
                <CardContent className="pt-8 pb-8 text-center">
                  <Mail className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                  <p className="text-slate-400 text-lg">No emails found.</p>
                </CardContent>
              </Card>
            ) : (
              displayedEmails.map((email, index) => (
                <Card
                  key={index}
                  onClick={() => setSelectedEmail(email)}
                  className="bg-slate-900/50 border-slate-800 backdrop-blur-sm hover:border-slate-700 cursor-pointer transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10 hover:scale-[1.01] animate-in fade-in slide-in-from-left-4"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <CardContent className="pt-4">
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <h3 className="text-white font-semibold text-lg truncate hover:text-blue-400 transition-colors">
                            {email.subject}
                          </h3>
                          <p className="text-slate-400 text-sm truncate">
                            <span className="text-slate-500">From:</span> {email.from}
                          </p>
                        </div>
                        {classified && email.category && (
                          <Badge
                            className={`${categoryColors[email.category] || categoryColors.General} border whitespace-nowrap`}
                          >
                            {email.category}
                          </Badge>
                        )}
                      </div>
                      <p className="text-slate-300 text-sm line-clamp-2">{email.snippet}</p>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>

        {/* Right Sidebar for Email Details */}
        {selectedEmail && (
          <EmailDetailsSidebar
            email={selectedEmail}
            onClose={() => setSelectedEmail(null)}
            categoryColors={categoryColors}
          />
        )}

        <style>{`
          @keyframes slideIn {
            from {
              opacity: 0;
              transform: translateX(100%);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }
        `}</style>
      </div>
    </Layout>
  )
}
