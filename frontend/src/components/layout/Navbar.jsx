import { Bell, Mail, Moon, Search, ChevronDown, CalendarRange, Settings, User, LogOut } from 'lucide-react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/auth-context'

export default function Navbar() {
  const { user } = useAuth()
  const initials = (user?.name || 'User').slice(0, 2).toUpperCase()
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="sticky top-0 z-20 flex items-center justify-between gap-3 border-b border-blue-100 bg-white/95 px-4 py-3 shadow-sm backdrop-blur-xl"
    >
      <div className="flex items-center gap-3">
        <button type="button" className="rounded-2xl border border-slate-800 bg-slate-900/80 p-2 text-slate-300 transition hover:text-emerald-300 lg:hidden">
          <span className="block h-0.5 w-4 bg-current" />
          <span className="mt-1 block h-0.5 w-4 bg-current" />
          <span className="mt-1 block h-0.5 w-4 bg-current" />
        </button>

        <div className="hidden items-center gap-3 rounded-2xl border border-blue-100 bg-blue-50/70 px-3 py-2 md:flex">
          <Search size={16} className="text-blue-500" />
          <input
            type="text"
            placeholder="Search reports, products, customers"
            className="w-56 bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400 xl:w-64"
          />
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
          <button type="button" className="rounded-2xl border border-blue-100 bg-white p-2.5 text-blue-600 transition hover:bg-blue-50">
          <Bell size={18} />
        </button>
          <button type="button" className="rounded-2xl border border-blue-100 bg-white p-2.5 text-blue-600 transition hover:bg-blue-50">
          <Mail size={18} />
        </button>
          <button type="button" className="rounded-2xl border border-blue-100 bg-white p-2.5 text-blue-600 transition hover:bg-blue-50">
          <Moon size={18} />
        </button>

        <div className="group relative hidden md:block">
          <button type="button" className="flex items-center gap-3 rounded-2xl border border-blue-100 bg-white px-3 py-2 text-left transition hover:border-blue-300">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 font-semibold text-blue-700">{initials}</div>
            <div className="hidden xl:block">
              <p className="text-sm font-semibold text-slate-900">{user?.name || 'User'}</p>
              <p className="text-xs text-slate-500">{user?.email || ''}</p>
            </div>
            <ChevronDown size={16} className="text-slate-400" />
          </button>

          <div className="absolute right-0 top-12 hidden w-48 rounded-2xl border border-slate-800 bg-slate-900/95 p-2 shadow-[0_10px_30px_rgba(2,6,23,0.5)] group-hover:block">
            <Link to="/admin/profile" className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-slate-300 transition hover:bg-slate-800 hover:text-white">
              <User size={15} /> Profile
            </Link>
            <Link to="/admin/settings" className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-slate-300 transition hover:bg-slate-800 hover:text-white">
              <Settings size={15} /> Settings
            </Link>
            <Link to="/admin/logout" className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-rose-300 transition hover:bg-slate-800 hover:text-rose-200">
              <LogOut size={15} /> Logout
            </Link>
          </div>
        </div>

        <div className="hidden items-center gap-2 rounded-2xl border border-slate-800 bg-slate-900/70 px-3 py-2 xl:flex">
          <CalendarRange size={16} className="text-emerald-300" />
          <span className="text-sm text-slate-300">Apr 01 - Apr 30</span>
        </div>
      </div>
    </motion.header>
  )
}
