"use client"

import Link from "next/link"
import { useSession, signIn, signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { useTheme } from "next-themes"
import { SunIcon, MoonIcon, PlusIcon } from "@heroicons/react/24/outline"
import { Pencil } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useState } from "react"

export function Navigation() {
  const { data: session } = useSession()
  const { theme, setTheme } = useTheme()
  const [showAuthDialog, setShowAuthDialog] = useState(false)

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/50 backdrop-blur-sm border-b border-white/10">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-xl font-bold text-white">
              IBRIPEDIA
            </Link>
            <Link href="/articles">
              <Button variant="ghost" className="text-white hover:bg-white/10">
                Статьи
              </Button>
            </Link>
            <Link href="/discussions">
              <Button variant="ghost" className="text-white hover:bg-white/10">
                Обсуждения
              </Button>
            </Link>
          </div>
          <div className="flex items-center gap-4">
            {session ? (
              <>
                <Link href="/articles/new">
                  <Button className="bg-white text-black hover:bg-gray-100">
                    <PlusIcon className="h-5 w-5 mr-2" />
                    Создать статью
                  </Button>
                </Link>
                <div className="flex items-center gap-2 text-white">
                  {session.user?.image && (
                    <img
                      src={session.user.image}
                      alt={session.user.name || ""}
                      className="w-8 h-8 rounded-full"
                    />
                  )}
                  <span className="text-sm font-medium">
                    {session.user?.name}
                  </span>
                </div>
                <Button 
                  variant="outline" 
                  className="border-white text-white hover:bg-white/10"
                  onClick={() => signOut()}
                >
                  Выйти
                </Button>
              </>
            ) : (
              <>
                <Button 
                  className="bg-white text-black hover:bg-gray-100"
                  onClick={() => setShowAuthDialog(true)}
                >
                  Войти
                </Button>
                <Dialog open={showAuthDialog} onOpenChange={setShowAuthDialog}>
                  <DialogContent className="sm:max-w-[425px] bg-white dark:bg-gray-900">
                    <DialogHeader>
                      <DialogTitle className="text-center text-2xl font-bold">
                        Войти в IBRIPEDIA
                      </DialogTitle>
                    </DialogHeader>
                    <div className="flex flex-col gap-4 py-4">
                      <Button
                        className="w-full flex items-center justify-center gap-2 bg-[#5865F2] hover:bg-[#4752C4] text-white"
                        onClick={() => signIn("discord")}
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z"/>
                        </svg>
                        Войти через Discord
                      </Button>
                      <Button
                        className="w-full flex items-center justify-center gap-2 bg-white hover:bg-gray-100 text-gray-900 border border-gray-300"
                        onClick={() => signIn("google")}
                      >
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                          <path fill="#EA4335" d="M5.266 9.765A7.077 7.077 0 0 1 12 4.909c1.69 0 3.218.6 4.418 1.582L19.91 3C17.782 1.145 15.055 0 12 0 7.27 0 3.198 2.698 1.24 6.65l4.026 3.115Z"/>
                          <path fill="#34A853" d="M16.04 18.013c-1.09.703-2.474 1.078-4.04 1.078a7.077 7.077 0 0 1-6.723-4.823l-4.04 3.067A11.965 11.965 0 0 0 12 24c2.933 0 5.735-1.043 7.834-3l-3.793-2.987Z"/>
                          <path fill="#4A90E2" d="M19.834 21c2.195-2.048 3.62-5.096 3.62-9 0-.71-.109-1.473-.272-2.182H12v4.637h6.436c-.317 1.559-1.17 2.766-2.395 3.558L19.834 21Z"/>
                          <path fill="#FBBC05" d="M5.277 14.268A7.12 7.12 0 0 1 4.909 12c0-.782.125-1.533.357-2.235L1.24 6.65A11.934 11.934 0 0 0 0 12c0 1.92.445 3.73 1.237 5.335l4.04-3.067Z"/>
                        </svg>
                        Войти через Google
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </>
            )}
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/10"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              {theme === "dark" ? (
                <SunIcon className="h-5 w-5" />
              ) : (
                <MoonIcon className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>
      </div>
    </nav>
  )
} 