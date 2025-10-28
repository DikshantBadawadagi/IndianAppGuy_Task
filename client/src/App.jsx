"use client"

import { useEffect, useState } from "react"
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom"
import EmailsPage from "./EmailsPage"
import Dashboard from "./Dashboard"
import { saveEmails, clearEmailCache } from "./storageHelpers"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Mail, LogOut, Key, CheckCircle2, Loader2, Shield, Zap } from "lucide-react"
import Layout from "./Layout"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

function Home() {
  const [user, setUser] = useState(null)
  const [apiKey, setApiKey] = useState("")
  const [keySaved, setKeySaved] = useState(false)
  const [loading, setLoading] = useState(false)
  const [fetchingEmails, setFetchingEmails] = useState(false)
  const [showApiKeyAlert, setShowApiKeyAlert] = useState(false)
  const navigate = useNavigate()

  const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  const REDIRECT_URI = import.meta.env.VITE_REDIRECT_URI;

  //console.log(` this is the vite env baby ${CLIENT_ID} + ${REDIRECT_URI}`);
  

  useEffect(() => {
    const hashParams = new URLSearchParams(window.location.hash.substring(1))
    const accessToken = hashParams.get("access_token")

    if (accessToken) {
      localStorage.setItem("access_token", accessToken)
      window.location.hash = ""
    }

    const token = localStorage.getItem("access_token")
    if (token && !user) {
      setLoading(true)
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
          }
          localStorage.setItem("user", JSON.stringify(userData))
          setUser(userData)
        })
        .catch((err) => console.error("Error fetching user info:", err))
        .finally(() => setLoading(false))
    } else {
      const savedUser = localStorage.getItem("user")
      if (savedUser) setUser(JSON.parse(savedUser))
    }

    const savedKey = localStorage.getItem("openai_api_key")
    if (savedKey) {
      setApiKey(savedKey)
      setKeySaved(true)
    }
  }, [])

  const handleLogin = () => {
    const scope = encodeURIComponent(
      "https://www.googleapis.com/auth/gmail.readonly https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile openid",
    )
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=token&scope=${scope}`
    window.location.href = authUrl
  }

  const handleLogout = () => {
    localStorage.removeItem("access_token")
    localStorage.removeItem("user")
    localStorage.removeItem("emails")
    localStorage.removeItem("classifiedEmails")
    localStorage.removeItem("emailsMeta")
    localStorage.removeItem("openai_api_key")
    setUser(null)
  }

  const handleSaveKey = () => {
    if (apiKey.trim()) {
      setShowApiKeyAlert(true)
    }
  }

  const handleRemoveKey = () => {
    localStorage.removeItem("openai_api_key")
    setApiKey("")
    setKeySaved(false)
  }

  const fetchEmails = async () => {
    try {
      setFetchingEmails(true)
      clearEmailCache()

      const res = await fetch("http://localhost:5000/fetch-emails", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          access_token: user.access_token,
          numEmails: 15,
        }),
      })

      const data = await res.json()
      console.log("Fetched emails:", data.emails)

      if (data.emails && data.emails.length > 0) {
        saveEmails(data.emails)
        navigate("/emails")
      } else {
        alert("No emails found or failed to fetch emails.")
      }
    } catch (err) {
      console.error("Error fetching emails:", err)
      alert("Failed to fetch emails.")
    } finally {
      setFetchingEmails(false)
    }
  }

  return (
    <Layout user={user}>
      <div className="fixed inset-0 pointer-events-none opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: "radial-gradient(circle, #ffffff 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      <div className="flex items-center justify-center min-h-[calc(100vh-120px)] p-4 relative z-10">
        {loading ? (
          <div className="flex flex-col items-center justify-center gap-4">
            <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
            <p className="text-slate-400">Loading your profile...</p>
          </div>
        ) : !user ? (
          <div className="w-full max-w-2xl space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Card className="border-slate-700 bg-slate-950/80 backdrop-blur-xl shadow-2xl overflow-hidden">
              <CardHeader className="space-y-4 text-center pb-6">
                <div className="flex justify-center mb-2">
                  <div className="p-4 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl shadow-lg shadow-blue-500/20">
                    <Mail className="w-8 h-8 text-white" />
                  </div>
                </div>
                <div>
                  <CardTitle className="text-3xl font-bold text-white mb-2">Gmail Classifier</CardTitle>
                  <CardDescription className="text-slate-400 text-base">
                    Organize your emails with AI-powered classification
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button
                  onClick={handleLogin}
                  className="w-full bg-gradient-to-r from-slate-700 to-slate-800 hover:from-slate-600 hover:to-slate-700 text-white font-semibold py-6 rounded-lg transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg shadow-slate-700/20"
                >
                  <Mail className="w-5 h-5 mr-2" />
                  Login with Google
                </Button>
                <p className="text-xs text-slate-500 text-center">
                  We only access your email for classification purposes
                </p>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="border-slate-700 bg-slate-900/30 backdrop-blur-sm hover:bg-slate-900/50 transition-all duration-300">
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center text-center gap-3">
                    <div className="p-3 bg-blue-500/20 rounded-lg">
                      <Zap className="w-6 h-6 text-blue-400" />
                    </div>
                    <h3 className="font-semibold text-white">AI Classification</h3>
                    <p className="text-sm text-slate-400">Automatically categorize emails using OpenAI</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-slate-700 bg-slate-900/30 backdrop-blur-sm hover:bg-slate-900/50 transition-all duration-300">
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center text-center gap-3">
                    <div className="p-3 bg-cyan-500/20 rounded-lg">
                      <Mail className="w-6 h-6 text-cyan-400" />
                    </div>
                    <h3 className="font-semibold text-white">Gmail Integration</h3>
                    <p className="text-sm text-slate-400">Seamlessly connect to your Gmail account</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-slate-700 bg-slate-900/30 backdrop-blur-sm hover:bg-slate-900/50 transition-all duration-300">
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center text-center gap-3">
                    <div className="p-3 bg-emerald-500/20 rounded-lg">
                      <Shield className="w-6 h-6 text-emerald-400" />
                    </div>
                    <h3 className="font-semibold text-white">Secure & Private</h3>
                    <p className="text-sm text-slate-400">Your data is encrypted and never stored</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        ) : (
          <div className="w-full max-w-2xl space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Card className="border-slate-700 bg-slate-950/80 backdrop-blur-xl shadow-2xl overflow-hidden">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-4">
                  <Avatar className="w-16 h-16 border-2 border-blue-500/50">
                    <AvatarImage src={user.picture || "/placeholder.svg"} alt={user.name} />
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-cyan-500 text-white">
                      {user.name?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <CardTitle className="text-white text-xl">{user.name}</CardTitle>
                    <CardDescription className="text-slate-400">{user.email}</CardDescription>
                  </div>
                  <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Connected</Badge>
                </div>
              </CardHeader>
            </Card>

            <Card className="border-slate-700 bg-slate-900/50 backdrop-blur-xl shadow-2xl">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Mail className="w-5 h-5 text-blue-400" />
                  Fetch & Classify Emails
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Retrieve your latest emails for AI-powered classification
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  onClick={fetchEmails}
                  disabled={fetchingEmails}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-6 rounded-lg transition-all duration-300 transform hover:scale-105 active:scale-95 disabled:opacity-50"
                >
                  {fetchingEmails ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Fetching Emails...
                    </>
                  ) : (
                    <>
                      <Mail className="w-5 h-5 mr-2" />
                      Fetch My Emails
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            <Card className="border-slate-700 bg-slate-900/50 backdrop-blur-xl shadow-2xl">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Key className="w-5 h-5 text-purple-400" />
                  OpenAI API Key
                </CardTitle>
                <CardDescription className="text-slate-400">Required for email classification</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {!keySaved ? (
                  <div className="space-y-3">
                    <Input
                      type="password"
                      placeholder="Enter your OpenAI API key"
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      className="bg-slate-900 border-slate-700 text-white placeholder:text-slate-500 focus:border-slate-600 focus:ring-slate-600/20"
                    />
                    <AlertDialog open={showApiKeyAlert} onOpenChange={setShowApiKeyAlert}>
                      <AlertDialogTrigger asChild>
                        <Button
                          onClick={() => setShowApiKeyAlert(true)}
                          disabled={!apiKey.trim()}
                          className="w-full bg-gradient-to-r from-slate-700 to-slate-800 hover:from-slate-600 hover:to-slate-700 text-white font-semibold transition-all duration-300 transform hover:scale-105 active:scale-95 disabled:opacity-50"
                        >
                          Save API Key
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="bg-slate-950 border-slate-700">
                        <AlertDialogHeader>
                          <AlertDialogTitle className="text-white">Save API Key</AlertDialogTitle>
                          <AlertDialogDescription className="text-slate-400">
                            Your OpenAI API key will be hashed and securely cached in your local storage. Your key will
                            not be sent to any external servers and remains completely private on your device.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <div className="flex gap-3">
                          <AlertDialogCancel className="bg-slate-800 text-slate-300 hover:bg-slate-700 border-slate-700">
                            Cancel
                          </AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => {
                              localStorage.setItem("openai_api_key", apiKey.trim())
                              setKeySaved(true)
                              setShowApiKeyAlert(false)
                            }}
                            className="bg-slate-700 hover:bg-slate-600 text-white"
                          >
                            Save Securely
                          </AlertDialogAction>
                        </div>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                ) : (
                  <div className="space-y-3 p-4 bg-slate-800/50 rounded-lg border border-slate-700">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-400" />
                      <span className="text-slate-300">
                        API Key saved: <span className="font-mono text-sm text-slate-400">sk-••••••••</span>
                      </span>
                    </div>
                    <Button
                      onClick={handleRemoveKey}
                      variant="destructive"
                      className="w-full bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-500/30 font-semibold transition-all duration-300"
                    >
                      Remove Key
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            <Separator className="bg-slate-700" />
            <Button
              onClick={handleLogout}
              variant="outline"
              className="w-full border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white font-semibold py-6 transition-all duration-300 bg-transparent"
            >
              <LogOut className="w-5 h-5 mr-2" />
              Logout
            </Button>
          </div>
        )}
      </div>
    </Layout>
  )
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/emails" element={<EmailsPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  )
}
