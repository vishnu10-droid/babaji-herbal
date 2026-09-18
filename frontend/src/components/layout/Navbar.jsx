import { useCallback, useEffect, useState } from 'react'
import axios from 'axios'
import {
  AlertTriangle,
  Bell,
  CalendarRange,
  CheckCheck,
  ChevronDown,
  LogOut,
  Mail,
  Moon,
  RefreshCw,
  Search,
  Settings,
  ShoppingCart,
  Sun,
  User,
} from 'lucide-react'
import { motion } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/auth-context'
import { API_URL } from '../../config/config'
import { getAdminOrders, getDashboardStats } from '../../service/admin.api'

const SEEN_NOTIFS_KEY = 'admin-seen-notifs'
const SEEN_MSGS_KEY = 'admin-seen-msgs'
const THEME_KEY = 'admin-theme'

const readIds = (key) => {
  try {
    const parsed = JSON.parse(localStorage.getItem(key) || '[]')
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

const timeAgo = (value) => {
  if (!value) return ''
  const seconds = Math.floor((Date.now() - new Date(value).getTime()) / 1000)
  if (Number.isNaN(seconds) || seconds < 0) return 'just now'
  if (seconds < 60) return 'just now'
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days < 30) return `${days}d ago`
  return new Date(value).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })
}

const authHeaders = () => {
  const token = localStorage.getItem('auth_token')
  return token ? { Authorization: `Bearer ${token}` } : {}
}

export default function Navbar() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const initials = (user?.name || 'User').slice(0, 2).toUpperCase()

  const [theme, setTheme] = useState(() => localStorage.getItem(THEME_KEY) || 'light')
  const [openPanel, setOpenPanel] = useState(null) // 'bell' | 'mail' | null

  const [orders, setOrders] = useState([])
  const [lowStock, setLowStock] = useState([])
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)

  const [seenNotifs, setSeenNotifs] = useState(() => readIds(SEEN_NOTIFS_KEY))
  const [seenMsgs, setSeenMsgs] = useState(() => readIds(SEEN_MSGS_KEY))

  // ---------- Theme (dark / light) ----------
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
    localStorage.setItem(THEME_KEY, theme)
  }, [theme])

  // ---------- Live data ----------
  const fetchAll = useCallback(async () => {
    setLoading(true)
    try {
      const [ordersRes, statsRes, contactsRes] = await Promise.allSettled([
        getAdminOrders(),
        getDashboardStats(),
        axios.get(`${API_URL}/contact`, { headers: authHeaders() }),
      ])
      if (ordersRes.status === 'fulfilled') {
        setOrders(Array.isArray(ordersRes.value) ? ordersRes.value : [])
      }
      if (statsRes.status === 'fulfilled') {
        setLowStock(statsRes.value?.lowStock || [])
      }
      if (contactsRes.status === 'fulfilled') {
        setMessages(contactsRes.value.data?.contacts || [])
      }
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchAll()
    const timer = setInterval(fetchAll, 60000)
    return () => clearInterval(timer)
  }, [fetchAll])

  const togglePanel = (panel) => {
    setOpenPanel((current) => {
      if (current !== panel) fetchAll()
      return current === panel ? null : panel
    })
  }

  // ---------- Notifications: pending orders + low stock ----------
  const pendingOrders = orders.filter((o) =>
    ['Pending', 'Processing'].includes(o.status),
  )
  const notifications = [
    ...pendingOrders.slice(0, 5).map((o) => ({
      id: `order-${o._id}`,
      title: `New order #${String(o._id || '').slice(-6).toUpperCase()}`,
      subtitle: `${o.user?.name || o.shippingAddress?.name || 'Customer'} · ₹${Number(o.totalAmount || 0).toLocaleString('en-IN')} · ${o.status || 'Pending'}`,
      time: o.createdAt,
      to: '/admin/orders',
      icon: ShoppingCart,
      tone: 'bg-amber-50 text-amber-600',
    })),
    ...lowStock.slice(0, 5).map((p, i) => ({
      id: `stock-${p._id || p.name || i}`,
      title: `Low stock: ${p.name || 'Product'}`,
      subtitle: `Only ${p.stock ?? 0} left in inventory`,
      time: p.updatedAt || p.createdAt,
      to: '/admin/products',
      icon: AlertTriangle,
      tone: 'bg-rose-50 text-rose-600',
    })),
  ]
  const unreadNotifs = notifications.filter((n) => !seenNotifs.includes(n.id))
  const unreadMsgs = messages.filter((m) => !seenMsgs.includes(m._id))

  const markAllRead = (kind) => {
    if (kind === 'bell') {
      const ids = notifications.map((n) => n.id)
      setSeenNotifs(ids)
      localStorage.setItem(SEEN_NOTIFS_KEY, JSON.stringify(ids))
    } else {
      const ids = messages.map((m) => m._id)
      setSeenMsgs(ids)
      localStorage.setItem(SEEN_MSGS_KEY, JSON.stringify(ids))
    }
  }

  const openNotif = (to) => {
    setOpenPanel(null)
    navigate(to)
  }

  const iconBtn =
    'relative rounded-2xl border border-blue-100 bg-white p-2.5 text-blue-600 transition hover:bg-blue-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700'

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="sticky top-0 z-20 flex items-center justify-between gap-3 border-b border-emerald-100 bg-white/95 px-4 py-3 shadow-sm backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/95"
    >
      <div className="flex items-center gap-3">
        <button type="button" className="rounded-2xl border border-slate-800 bg-slate-900/80 p-2 text-slate-300 transition hover:text-emerald-300 lg:hidden">
          <span className="block h-0.5 w-4 bg-current" />
          <span className="mt-1 block h-0.5 w-4 bg-current" />
          <span className="mt-1 block h-0.5 w-4 bg-current" />
        </button>

        <div className="hidden items-center gap-3 rounded-2xl border border-emerald-100 bg-emerald-50/70 px-3 py-2 dark:border-slate-700 dark:bg-slate-800 md:flex">
          <Search size={16} className="text-emerald-600 dark:text-emerald-400" />
          <input
            type="text"
            placeholder="Search reports, products, customers"
            className="w-56 bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400 dark:text-slate-100 xl:w-64"
          />
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        {/* Notifications */}
        <div className="relative">
          <button
            type="button"
            onClick={() => togglePanel('bell')}
            title="Notifications"
            aria-label="Notifications"
            className={`${iconBtn} ${openPanel === 'bell' ? 'bg-blue-50 dark:bg-slate-700' : ''}`}
          >
            <Bell size={18} />
            {unreadNotifs.length > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white ring-2 ring-white dark:ring-slate-900">
                {unreadNotifs.length > 9 ? '9+' : unreadNotifs.length}
              </span>
            )}
          </button>

          {openPanel === 'bell' && (
            <>
              <button
                type="button"
                aria-label="Close notifications"
                onClick={() => setOpenPanel(null)}
                className="fixed inset-0 z-30 cursor-default bg-transparent"
              />
              <div className="absolute right-0 top-12 z-40 w-80 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-900">
                <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3 dark:border-slate-800">
                  <p className="text-sm font-bold text-slate-900 dark:text-white">
                    Notifications {unreadNotifs.length > 0 && `(${unreadNotifs.length})`}
                  </p>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => fetchAll()}
                      title="Refresh"
                      className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800"
                    >
                      <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
                    </button>
                    <button
                      type="button"
                      onClick={() => markAllRead('bell')}
                      title="Mark all read"
                      className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-emerald-600 dark:hover:bg-slate-800"
                    >
                      <CheckCheck size={15} />
                    </button>
                  </div>
                </div>
                <div className="max-h-80 overflow-y-auto p-2">
                  {notifications.length === 0 && (
                    <p className="px-3 py-6 text-center text-xs text-slate-400">
                      {loading ? 'Loading...' : 'No new notifications. All caught up!'}
                    </p>
                  )}
                  {notifications.map((n) => {
                    const Icon = n.icon
                    const unread = !seenNotifs.includes(n.id)
                    return (
                      <button
                        key={n.id}
                        type="button"
                        onClick={() => openNotif(n.to)}
                        className={`flex w-full items-start gap-3 rounded-xl px-3 py-2.5 text-left transition hover:bg-slate-50 dark:hover:bg-slate-800 ${unread ? 'bg-emerald-50/60 dark:bg-emerald-500/10' : ''}`}
                      >
                        <span className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${n.tone}`}>
                          <Icon size={15} />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="flex items-center gap-2">
                            <span className="truncate text-xs font-bold text-slate-800 dark:text-slate-100">{n.title}</span>
                            {unread && <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />}
                          </span>
                          <span className="mt-0.5 block truncate text-[11px] text-slate-500 dark:text-slate-400">{n.subtitle}</span>
                          {n.time && <span className="mt-0.5 block text-[10px] text-slate-400">{timeAgo(n.time)}</span>}
                        </span>
                      </button>
                    )
                  })}
                </div>
                <Link
                  to="/admin/orders"
                  onClick={() => setOpenPanel(null)}
                  className="block border-t border-slate-100 px-4 py-2.5 text-center text-xs font-bold text-emerald-700 transition hover:bg-slate-50 dark:border-slate-800 dark:text-emerald-400 dark:hover:bg-slate-800"
                >
                  View all orders
                </Link>
              </div>
            </>
          )}
        </div>

        {/* Messages */}
        <div className="relative">
          <button
            type="button"
            onClick={() => togglePanel('mail')}
            title="Messages"
            aria-label="Messages"
            className={`${iconBtn} ${openPanel === 'mail' ? 'bg-blue-50 dark:bg-slate-700' : ''}`}
          >
            <Mail size={18} />
            {unreadMsgs.length > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white ring-2 ring-white dark:ring-slate-900">
                {unreadMsgs.length > 9 ? '9+' : unreadMsgs.length}
              </span>
            )}
          </button>

          {openPanel === 'mail' && (
            <>
              <button
                type="button"
                aria-label="Close messages"
                onClick={() => setOpenPanel(null)}
                className="fixed inset-0 z-30 cursor-default bg-transparent"
              />
              <div className="absolute right-0 top-12 z-40 w-80 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-900">
                <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3 dark:border-slate-800">
                  <p className="text-sm font-bold text-slate-900 dark:text-white">
                    Messages {unreadMsgs.length > 0 && `(${unreadMsgs.length})`}
                  </p>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => fetchAll()}
                      title="Refresh"
                      className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800"
                    >
                      <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
                    </button>
                    <button
                      type="button"
                      onClick={() => markAllRead('mail')}
                      title="Mark all read"
                      className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-emerald-600 dark:hover:bg-slate-800"
                    >
                      <CheckCheck size={15} />
                    </button>
                  </div>
                </div>
                <div className="max-h-80 overflow-y-auto p-2">
                  {messages.length === 0 && (
                    <p className="px-3 py-6 text-center text-xs text-slate-400">
                      {loading ? 'Loading...' : 'No contact messages yet.'}
                    </p>
                  )}
                  {messages.slice(0, 6).map((m) => {
                    const unread = !seenMsgs.includes(m._id)
                    return (
                      <button
                        key={m._id}
                        type="button"
                        onClick={() => openNotif('/admin/contact')}
                        className={`flex w-full items-start gap-3 rounded-xl px-3 py-2.5 text-left transition hover:bg-slate-50 dark:hover:bg-slate-800 ${unread ? 'bg-emerald-50/60 dark:bg-emerald-500/10' : ''}`}
                      >
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-100 text-[11px] font-bold text-blue-700 dark:bg-blue-500/20 dark:text-blue-300">
                          {(m.name || 'C').slice(0, 2).toUpperCase()}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="flex items-center justify-between gap-2">
                            <span className="truncate text-xs font-bold text-slate-800 dark:text-slate-100">{m.name}</span>
                            <span className="shrink-0 text-[10px] text-slate-400">{timeAgo(m.createdAt)}</span>
                          </span>
                          <span className="mt-0.5 block truncate text-[11px] text-slate-500 dark:text-slate-400">{m.message}</span>
                        </span>
                        {unread && <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />}
                      </button>
                    )
                  })}
                </div>
                <Link
                  to="/admin/contact"
                  onClick={() => setOpenPanel(null)}
                  className="block border-t border-slate-100 px-4 py-2.5 text-center text-xs font-bold text-emerald-700 transition hover:bg-slate-50 dark:border-slate-800 dark:text-emerald-400 dark:hover:bg-slate-800"
                >
                  View all messages
                </Link>
              </div>
            </>
          )}
        </div>

        {/* Dark / Light mode */}
        <button
          type="button"
          onClick={() => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))}
          title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          aria-label="Toggle theme"
          className={iconBtn}
        >
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        <div className="group relative hidden md:block">
          <button type="button" className="flex items-center gap-3 rounded-2xl border border-blue-100 bg-white px-3 py-2 text-left transition hover:border-blue-300 dark:border-slate-700 dark:bg-slate-800 dark:hover:border-slate-500">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 font-semibold text-blue-700 dark:bg-blue-500/20 dark:text-blue-300">{initials}</div>
            <div className="hidden xl:block">
              <p className="text-sm font-semibold text-slate-900 dark:text-white">{user?.name || 'User'}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">{user?.email || ''}</p>
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
