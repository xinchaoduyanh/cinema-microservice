"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Film, User, Menu } from "lucide-react"
import { useState } from "react"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-lg">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 transition-transform group-hover:scale-110">
              <Film className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gradient">CinemaHub</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link 
              href="/" 
              className="text-sm font-medium transition-colors hover:text-purple-600"
            >
              Trang chủ
            </Link>
            <Link 
              href="/movies" 
              className="text-sm font-medium transition-colors hover:text-purple-600"
            >
              Phim đang chiếu
            </Link>
            <Link 
              href="/movies/now-showing" 
              className="text-sm font-medium transition-colors hover:text-purple-600"
            >
              Phim sắp chiếu
            </Link>
            <Link 
              href="/cinemas" 
              className="text-sm font-medium transition-colors hover:text-purple-600"
            >
              Rạp chiếu
            </Link>
          </nav>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" size="sm">
                <User className="h-4 w-4 mr-2" />
                Đăng nhập
              </Button>
            </Link>
            <Link href="/register">
              <Button size="sm">
                Đăng ký
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 space-y-3 animate-fade-in">
            <Link 
              href="/" 
              className="block py-2 text-sm font-medium hover:text-purple-600"
            >
              Trang chủ
            </Link>
            <Link 
              href="/movies" 
              className="block py-2 text-sm font-medium hover:text-purple-600"
            >
              Phim đang chiếu
            </Link>
            <Link 
              href="/movies/now-showing" 
              className="block py-2 text-sm font-medium hover:text-purple-600"
            >
              Phim sắp chiếu
            </Link>
            <Link 
              href="/cinemas" 
              className="block py-2 text-sm font-medium hover:text-purple-600"
            >
              Rạp chiếu
            </Link>
            <div className="flex flex-col gap-2 pt-2">
              <Link href="/login">
                <Button variant="outline" className="w-full">
                  Đăng nhập
                </Button>
              </Link>
              <Link href="/register">
                <Button className="w-full">
                  Đăng ký
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
