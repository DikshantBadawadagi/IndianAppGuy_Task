"use client"

import { useNavigate } from "react-router-dom"
import { LogOut, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"

export default function Navbar({ user }) {
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem("access_token")
    localStorage.removeItem("user")
    localStorage.removeItem("emails")
    localStorage.removeItem("classifiedEmails")
    localStorage.removeItem("emailsMeta")
    localStorage.removeItem("openai_api_key")
    navigate("/")
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4">
      <div className="max-w-7xl mx-auto">
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 rounded-full px-8 py-4 backdrop-blur-md border border-slate-700 shadow-2xl flex items-center justify-between">
          {/* Left Side - Logo and User Info */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 bg-slate-800 rounded-full px-4 py-2 border border-slate-700">
              <Mail className="w-5 h-5 text-slate-300" />
              <span className="text-sm font-semibold text-slate-200">Gmail Classifier</span>
            </div>

            {user && (
              <div className="flex items-center gap-3 ml-4 pl-4 border-l border-slate-700">
                <Avatar className="w-10 h-10 border-2 border-slate-600">
                  <AvatarImage src={user.picture || "/placeholder.svg"} alt={user.name} />
                  <AvatarFallback className="bg-slate-700 text-slate-200">
                    {user.name?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden sm:block">
                  <p className="text-sm font-semibold text-slate-100">{user.name}</p>
                  <p className="text-xs text-slate-400">{user.email}</p>
                </div>
              </div>
            )}
          </div>

          {/* Right Side - Logout Button */}
          {user && (
            <Button
              onClick={handleLogout}
              variant="ghost"
              size="sm"
              className="flex items-center gap-2 text-slate-300 hover:text-slate-100 hover:bg-slate-700 transition-all duration-300"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          )}
        </div>
      </div>
    </nav>
  )
}
