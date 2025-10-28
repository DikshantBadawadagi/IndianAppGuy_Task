"use client"

import { useNavigate } from "react-router-dom"
import { LogOut, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useState } from "react"

export default function Navbar({ user }) {
  const navigate = useNavigate()

  const [showLogoutAlert, setShowLogoutAlert] = useState(false)

  const handleLogout = () => {
    setShowLogoutAlert(true)
  }

  const confirmLogout = () => {
    localStorage.removeItem("access_token")
    localStorage.removeItem("user")
    localStorage.removeItem("emails")
    localStorage.removeItem("classifiedEmails")
    localStorage.removeItem("emailsMeta")
    localStorage.removeItem("openai_api_key")
    setShowLogoutAlert(false)
    navigate("/")
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4">
      <div className="max-w-7xl mx-auto">
        <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 rounded-full px-8 py-4 backdrop-blur-md border border-slate-800 shadow-2xl flex items-center justify-between">
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

          {user && (
            <AlertDialog open={showLogoutAlert} onOpenChange={setShowLogoutAlert}>
              <Button
                onClick={handleLogout}
                variant="ghost"
                size="sm"
                className="flex items-center gap-2 text-slate-300 hover:text-slate-100 hover:bg-slate-800 transition-all duration-300"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
              <AlertDialogContent className="bg-slate-950 border-slate-700">
                <AlertDialogHeader>
                  <AlertDialogTitle className="text-white">Logout Confirmation</AlertDialogTitle>
                  <AlertDialogDescription className="text-slate-400">
                    Are you sure you want to logout? The following data will be permanently deleted:
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <div className="space-y-2 ml-4">
                  <ul className="list-disc list-inside space-y-1 text-slate-300 text-sm">
                    <li>All cached emails</li>
                    <li>Classification results</li>
                    <li>OpenAI API key</li>
                    <li>Session cookies</li>
                  </ul>
                </div>
                <div className="flex gap-3">
                  <AlertDialogCancel className="bg-slate-800 text-slate-300 hover:bg-slate-700 border-slate-700">
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction onClick={confirmLogout} className="bg-red-600 hover:bg-red-700 text-white">
                    Yes, Logout
                  </AlertDialogAction>
                </div>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
      </div>
    </nav>
  )
}
