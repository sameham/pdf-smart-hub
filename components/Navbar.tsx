'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronDown, Menu, X, FileText, MessageCircle } from 'lucide-react'
import { UserButton, SignInButton, useUser } from '@clerk/nextjs'

const TOOLS_MENU = [
  { href: '/merge-pdf', label: 'دمج PDF', icon: '📎' },
  { href: '/split-pdf', label: 'تقسيم PDF', icon: '✂️' },
  { href: '/compress-pdf', label: 'ضغط PDF', icon: '🗜️' },
  { href: '/pdf-to-image', label: 'PDF إلى صورة', icon: '🖼️' },
  { href: '/image-to-pdf', label: 'صورة إلى PDF', icon: '📸' },
  { href: '/protect-pdf', label: 'حماية PDF', icon: '🔒' },
  { href: '/word-to-pdf', label: 'Word إلى PDF', icon: '📝' },
  { href: '/pdf-to-word', label: 'PDF إلى Word', icon: '📄' },
  { href: '/ocr', label: 'استخراج نص OCR', icon: '🔍' },
  { href: '/rotate-pdf', label: 'تدوير PDF', icon: '🔄' },
  { href: '/watermark-pdf', label: 'علامة مائية', icon: '💧' },
  { href: '/unlock-pdf', label: 'فتح PDF', icon: '🔓' },
]

export default function Navbar() {
  const { isSignedIn } = useUser()
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [toolsOpen, setToolsOpen] = useState(false)

  return (
    <nav className="sticky top-0 z-50 bg-white/90 dark:bg-gray-950/90 backdrop-blur border-b border-gray-200 dark:border-gray-800" dir="rtl">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-bold text-lg text-gray-900 dark:text-white">
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center">
              <FileText className="w-5 h-5 text-white" />
            </div>
            PDF Smart Hub
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {/* Tools Dropdown */}
            <div className="relative" onMouseEnter={() => setToolsOpen(true)} onMouseLeave={() => setToolsOpen(false)}>
              <button className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition">
                الأدوات
                <ChevronDown className={`w-4 h-4 transition-transform ${toolsOpen ? 'rotate-180' : ''}`} />
              </button>
              {toolsOpen && (
                <div className="absolute top-full right-0 mt-1 w-64 bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-800 p-2 grid grid-cols-2 gap-1">
                  {TOOLS_MENU.map((tool) => (
                    <Link
                      key={tool.href}
                      href={tool.href}
                      className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 rounded-xl transition"
                    >
                      <span>{tool.icon}</span>
                      {tool.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link
              href="/chat"
              className={`flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-lg transition ${pathname === '/chat' ? 'text-blue-600 bg-blue-50 dark:bg-blue-900/20' : 'text-gray-700 dark:text-gray-300 hover:text-blue-600 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
            >
              <MessageCircle className="w-4 h-4" />
              Chat PDF
            </Link>

            <Link
              href="/pricing"
              className={`px-4 py-2 text-sm font-medium rounded-lg transition ${pathname === '/pricing' ? 'text-blue-600 bg-blue-50 dark:bg-blue-900/20' : 'text-gray-700 dark:text-gray-300 hover:text-blue-600 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
            >
              الأسعار
            </Link>

            <Link
              href="/about"
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition"
            >
              عن التطبيق
            </Link>
          </div>

          {/* Auth */}
          <div className="hidden md:flex items-center gap-3">
            {isSignedIn ? (
              <>
                <Link href="/dashboard" className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 transition">
                  لوحة التحكم
                </Link>
                <UserButton afterSignOutUrl="/" />
              </>
            ) : (
              <>
                <SignInButton mode="modal">
                  <button className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 transition">
                    دخول
                  </button>
                </SignInButton>
                <Link href="/sign-up" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-xl transition">
                  حساب جديد
                </Link>
              </>
            )}
          </div>

          {/* Mobile Toggle */}
          <button
            className="md:hidden p-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 px-4 py-4 space-y-1">
          <p className="text-xs font-semibold text-gray-400 px-3 py-1">الأدوات</p>
          <div className="grid grid-cols-2 gap-1 mb-3">
            {TOOLS_MENU.map((tool) => (
              <Link
                key={tool.href}
                href={tool.href}
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl transition"
              >
                <span>{tool.icon}</span>
                {tool.label}
              </Link>
            ))}
          </div>
          <Link href="/chat" onClick={() => setMobileOpen(false)} className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl">
            <MessageCircle className="w-4 h-4 text-blue-600" />
            Chat PDF
          </Link>
          <Link href="/pricing" onClick={() => setMobileOpen(false)} className="block px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl">
            الأسعار
          </Link>
          <Link href="/about" onClick={() => setMobileOpen(false)} className="block px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl">
            عن التطبيق
          </Link>
          {isSignedIn ? (
            <Link href="/dashboard" onClick={() => setMobileOpen(false)} className="block px-3 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-xl">
              لوحة التحكم
            </Link>
          ) : (
            <Link href="/sign-up" onClick={() => setMobileOpen(false)} className="block w-full text-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-xl mt-2 transition">
              حساب جديد مجاناً
            </Link>
          )}
        </div>
      )}
    </nav>
  )
}
