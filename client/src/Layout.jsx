import Navbar from "./Navbar"

export default function Layout({ children, user }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-slate-800 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div
          className="absolute bottom-0 right-1/4 w-96 h-96 bg-slate-800 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
      </div>

      <Navbar user={user} />
      <div className="relative z-10 pt-24">{children}</div>
    </div>
  )
}
