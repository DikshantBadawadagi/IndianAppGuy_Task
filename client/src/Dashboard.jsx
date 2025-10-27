// // import { useEffect, useState } from "react";
// // import { useNavigate } from "react-router-dom";

// // export default function Dashboard() {
// //   const [classifiedEmails, setClassifiedEmails] = useState([]);
// //   const navigate = useNavigate();

// //   useEffect(() => {
// //     const data = localStorage.getItem("classifiedEmails");
// //     if (data) {
// //       setClassifiedEmails(JSON.parse(data));
// //     } else {
// //       alert("No classified emails found. Please classify first!");
// //       navigate("/emails");
// //     }
// //   }, [navigate]);

// //   // Extract unique categories
// //   const categories = [...new Set(classifiedEmails.map((e) => e.category))];

// //   return (
// //     <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
// //       <h2>📊 Email Dashboard</h2>
// //       <button
// //         onClick={() => navigate("/emails")}
// //         style={{
// //           marginBottom: "1rem",
// //           padding: "8px 16px",
// //           borderRadius: "6px",
// //           cursor: "pointer",
// //         }}
// //       >
// //         ← Back to Emails
// //       </button>

// //       {categories.length === 0 ? (
// //         <p>No categories found.</p>
// //       ) : (
// //         <div
// //           style={{
// //             display: "grid",
// //             gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
// //             gap: "1.5rem",
// //           }}
// //         >
// //           {categories.map((cat) => (
// //             <div
// //               key={cat}
// //               style={{
// //                 background: "#f9f9f9",
// //                 borderRadius: "10px",
// //                 boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
// //                 padding: "1rem",
// //               }}
// //             >
// //               <h3 style={{ color: "#007bff" }}>{cat}</h3>
// //               {classifiedEmails
// //                 .filter((e) => e.category === cat)
// //                 .map((email, i) => (
// //                   <div
// //                     key={i}
// //                     style={{
// //                       marginTop: "0.8rem",
// //                       padding: "0.5rem",
// //                       borderBottom: "1px solid #ddd",
// //                     }}
// //                   >
// //                     <h4>{email.subject}</h4>
// //                     <p>
// //                       <strong>From:</strong> {email.from}
// //                     </p>
// //                     <p>{email.snippet}</p>
// //                   </div>
// //                 ))}
// //             </div>
// //           ))}
// //         </div>
// //       )}
// //     </div>
// //   );
// // }


// // src/Dashboard.jsx
// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { getClassifiedEmails } from "./storageHelpers";

// export default function Dashboard() {
//   const [classifiedEmails, setClassifiedEmails] = useState([]);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const data = getClassifiedEmails();
//     if (data.length > 0) {
//       setClassifiedEmails(data);
//     } else {
//       alert("No classified emails found. Please classify first!");
//       navigate("/emails");
//     }
//   }, [navigate]);

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

"use client"

import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { getClassifiedEmails } from "./storageHelpers"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Mail, BarChart3, TrendingUp, AlertCircle } from "lucide-react"
import Layout from "./Layout" 

export default function Dashboard() {
  const [classifiedEmails, setClassifiedEmails] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const data = getClassifiedEmails()
    if (data.length > 0) {
      setClassifiedEmails(data)
      setIsLoading(false)
    } else {
      alert("No classified emails found. Please classify first!")
      navigate("/emails")
    }
  }, [navigate])

  const categories = [...new Set(classifiedEmails.map((e) => e.category))]

  // Calculate statistics
  const totalEmails = classifiedEmails.length
  const categoryStats = categories.map((cat) => ({
    name: cat,
    count: classifiedEmails.filter((e) => e.category === cat).length,
    percentage: Math.round((classifiedEmails.filter((e) => e.category === cat).length / totalEmails) * 100),
  }))

  // Color mapping for categories
  const categoryColors = {
    Promotions: "bg-blue-500/20 text-blue-300 border-blue-500/30",
    Social: "bg-purple-500/20 text-purple-300 border-purple-500/30",
    Updates: "bg-green-500/20 text-green-300 border-green-500/30",
    Important: "bg-red-500/20 text-red-300 border-red-500/30",
    Spam: "bg-orange-500/20 text-orange-300 border-orange-500/30",
    Work: "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
    Personal: "bg-pink-500/20 text-pink-300 border-pink-500/30",
  }

  const getCategoryColor = (category) =>
    categoryColors[category] || "bg-slate-500/20 text-slate-300 border-slate-500/30"

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="animate-spin">
          <Mail className="w-12 h-12 text-blue-400" />
        </div>
      </div>
    )
  }

  return (
    <Layout user={JSON.parse(localStorage.getItem("user") || "{}")}>
      <div className="min-h-[calc(100vh-120px)] bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6 md:p-8">
        {/* Animated background elements */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div
            className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: "1s" }}
          ></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="mb-8 animate-fade-in">
            <Button
              onClick={() => navigate("/emails")}
              variant="ghost"
              className="mb-6 text-slate-300 hover:text-white hover:bg-slate-800/50 transition-all duration-300"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Emails
            </Button>

            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
                  <BarChart3 className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-4xl font-bold text-white">Email Analytics</h1>
              </div>
              <p className="text-slate-400">Comprehensive overview of your classified emails</p>
            </div>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Card
              className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm hover:border-slate-600/50 transition-all duration-300 animate-slide-up"
              style={{ animationDelay: "0.1s" }}
            >
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-slate-300">Total Emails</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-white">{totalEmails}</div>
                <p className="text-xs text-slate-400 mt-1">Classified emails</p>
              </CardContent>
            </Card>

            <Card
              className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm hover:border-slate-600/50 transition-all duration-300 animate-slide-up"
              style={{ animationDelay: "0.2s" }}
            >
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-slate-300">Categories</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-white">{categories.length}</div>
                <p className="text-xs text-slate-400 mt-1">Unique categories</p>
              </CardContent>
            </Card>

            <Card
              className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm hover:border-slate-600/50 transition-all duration-300 animate-slide-up"
              style={{ animationDelay: "0.3s" }}
            >
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-slate-300">Avg per Category</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-white">{Math.round(totalEmails / categories.length)}</div>
                <p className="text-xs text-slate-400 mt-1">Emails per category</p>
              </CardContent>
            </Card>
          </div>

          {/* Category Distribution */}
          <Card
            className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm mb-8 animate-slide-up"
            style={{ animationDelay: "0.4s" }}
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <TrendingUp className="w-5 h-5 text-blue-400" />
                Category Distribution
              </CardTitle>
              <CardDescription className="text-slate-400">Email breakdown by category</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {categoryStats.map((stat, idx) => (
                  <div key={stat.name} className="animate-fade-in" style={{ animationDelay: `${0.5 + idx * 0.1}s` }}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-slate-300">{stat.name}</span>
                      <span className="text-sm font-bold text-white">
                        {stat.count} emails ({stat.percentage}%)
                      </span>
                    </div>
                    <div className="w-full bg-slate-700/50 rounded-full h-2 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-500"
                        style={{ width: `${stat.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Category Cards Grid */}
          {categories.length === 0 ? (
            <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3 text-slate-400">
                  <AlertCircle className="w-5 h-5" />
                  <p>No categories found.</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {categories.map((cat, catIdx) => (
                <Card
                  key={cat}
                  className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm hover:border-slate-600/50 transition-all duration-300 overflow-hidden group animate-slide-up"
                  style={{ animationDelay: `${0.6 + catIdx * 0.1}s` }}
                >
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-white">{cat}</CardTitle>
                      <Badge className={`${getCategoryColor(cat)} border`}>
                        {classifiedEmails.filter((e) => e.category === cat).length}
                      </Badge>
                    </div>
                    <CardDescription className="text-slate-400">
                      {classifiedEmails.filter((e) => e.category === cat).length} email
                      {classifiedEmails.filter((e) => e.category === cat).length !== 1 ? "s" : ""}
                    </CardDescription>
                  </CardHeader>

                  <Separator className="bg-slate-700/50" />

                  <CardContent className="pt-4">
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {classifiedEmails
                        .filter((e) => e.category === cat)
                        .map((email, i) => (
                          <div
                            key={i}
                            className="p-3 bg-slate-700/30 rounded-lg hover:bg-slate-700/50 transition-all duration-200 border border-slate-600/30 hover:border-slate-500/50 group/item"
                          >
                            <h4 className="font-semibold text-white text-sm group-hover/item:text-blue-300 transition-colors truncate">
                              {email.subject}
                            </h4>
                            <p className="text-xs text-slate-400 mt-1 truncate">
                              <span className="font-medium">From:</span> {email.from}
                            </p>
                            <p className="text-xs text-slate-500 mt-2 line-clamp-2">{email.snippet}</p>
                          </div>
                        ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        <style>{`
          @keyframes fade-in {
            from {
              opacity: 0;
            }
            to {
              opacity: 1;
            }
          }

          @keyframes slide-up {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          .animate-fade-in {
            animation: fade-in 0.6s ease-out forwards;
            opacity: 0;
          }

          .animate-slide-up {
            animation: slide-up 0.6s ease-out forwards;
            opacity: 0;
          }
        `}</style>
      </div>
    </Layout>
  )
}
