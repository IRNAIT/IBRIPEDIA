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
                        <svg className="w-5 h-5" viewBox="0 0 127.14 96.36">
                          <path fill="currentColor" d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.79,32.65-1.71,56.6.54,80.21h0A105.73,105.73,0,0,0,32.71,96.36,77.7,77.7,0,0,0,39.6,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77,77,0,0,0,6.89,11.1A105.25,105.25,0,0,0,126.6,80.22h0C129.24,52.84,122.09,29.11,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53s5-12.74,11.43-12.74S54,46,53.89,53,48.84,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.25,60,73.25,53s5-12.74,11.44-12.74S96.23,46,96.12,53,91.08,65.69,84.69,65.69Z"/>
                        </svg>
                        Войти через Discord
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