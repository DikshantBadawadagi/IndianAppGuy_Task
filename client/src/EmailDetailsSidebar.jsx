"use client"

import { X, Mail, User, Calendar, Tag, Copy, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useState } from "react"

export default function EmailDetailsSidebar({ email, onClose, categoryColors }) {
  const [copiedField, setCopiedField] = useState(null)

  const handleCopy = (text, field) => {
    navigator.clipboard.writeText(text)
    setCopiedField(field)
    setTimeout(() => setCopiedField(null), 2000)
  }

  return (
    <>
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 animate-in fade-in duration-300"
      />

      <div className="fixed top-0 right-0 w-full md:w-[50%] h-full bg-gradient-to-b from-slate-900 to-slate-950 border-l border-slate-800 shadow-2xl z-50 overflow-y-auto animate-in slide-in-from-right duration-300">
        <div className="sticky top-0 bg-slate-900/95 backdrop-blur-sm border-b border-slate-800 p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg">
              <Mail className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-bold text-white">Email Details</h2>
          </div>
          <Button
            onClick={onClose}
            variant="ghost"
            size="icon"
            className="hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="p-6 space-y-6">
          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
            <CardContent className="pt-4">
              <p className="text-slate-400 text-xs uppercase tracking-wider font-semibold mb-2">Subject</p>
              <h3 className="text-white text-lg font-bold break-words">{email.subject}</h3>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-slate-400 text-xs uppercase tracking-wider font-semibold flex items-center gap-2">
                <User className="w-4 h-4" />
                From
              </label>
              <div className="flex items-center justify-between gap-2 bg-slate-800/50 rounded-lg p-3 border border-slate-700 hover:border-slate-600 transition-colors">
                <p className="text-white text-sm break-all">{email.from}</p>
                <Button
                  onClick={() => handleCopy(email.from, "from")}
                  variant="ghost"
                  size="icon"
                  className="flex-shrink-0 hover:bg-slate-700 text-slate-400 hover:text-white"
                >
                  {copiedField === "from" ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-slate-400 text-xs uppercase tracking-wider font-semibold flex items-center gap-2">
                <Mail className="w-4 h-4" />
                To
              </label>
              <div className="flex items-center justify-between gap-2 bg-slate-800/50 rounded-lg p-3 border border-slate-700 hover:border-slate-600 transition-colors">
                <p className="text-white text-sm break-all">{email.to}</p>
                <Button
                  onClick={() => handleCopy(email.to, "to")}
                  variant="ghost"
                  size="icon"
                  className="flex-shrink-0 hover:bg-slate-700 text-slate-400 hover:text-white"
                >
                  {copiedField === "to" ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-slate-400 text-xs uppercase tracking-wider font-semibold flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Date
              </label>
              <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700">
                <p className="text-white text-sm">{email.date}</p>
              </div>
            </div>

            {email.category && (
              <div className="space-y-2">
                <label className="text-slate-400 text-xs uppercase tracking-wider font-semibold flex items-center gap-2">
                  <Tag className="w-4 h-4" />
                  Category
                </label>
                <Badge
                  className={`${categoryColors?.[email.category] || "bg-slate-700 text-slate-300"} border text-base py-2 px-3 w-fit`}
                >
                  {email.category}
                </Badge>
              </div>
            )}
          </div>

          <Separator className="bg-slate-700" />

          <div className="space-y-3">
            <h4 className="text-slate-400 text-xs uppercase tracking-wider font-semibold">Message</h4>
            <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm overflow-hidden">
              <CardContent className="pt-4">
                <div className="email-body-container text-slate-300 text-sm leading-relaxed max-w-none">
                  {email.body ? (
                    <div dangerouslySetInnerHTML={{ __html: email.body }} />
                  ) : (
                    <p className="text-slate-500 italic">(No content)</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes slideInFromRight {
          from {
            opacity: 0;
            transform: translateX(100%);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .email-body-container {
          all: revert;
          color: rgb(203, 213, 225);
          font-size: 0.875rem;
          line-height: 1.625;
        }

        .email-body-container * {
          all: revert;
          color: inherit;
          font-family: inherit;
        }

        .email-body-container a {
          color: #60a5fa;
          text-decoration: underline;
        }

        .email-body-container a:hover {
          color: #93c5fd;
        }

        .email-body-container img {
          max-width: 100%;
          height: auto;
          border-radius: 0.5rem;
          margin: 0.5rem 0;
        }

        .email-body-container table {
          width: 100%;
          border-collapse: collapse;
          margin: 0.5rem 0;
        }

        .email-body-container td,
        .email-body-container th {
          border: 1px solid rgb(71, 85, 105);
          padding: 0.5rem;
        }
      `}</style>
    </>
  )
}
