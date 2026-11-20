import { useEffect, useState, lazy, Suspense } from 'react'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { auth } from './firebase'
import { T } from './i18n'
import AuthPage from './AuthPage'
import PathPage, { Dashboard } from './PathPage'
const Background3D = lazy(() => import('./Background3D'))

const weak = () => (navigator.deviceMemory && navigator.deviceMemory <= 2) || (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4) || matchMedia('(prefers-reduced-motion: reduce)').matches
const pref = (k, d) => { const v = localStorage.getItem(k); return v === null ? d : v }

export default function App() {
  const [user, setUser] = useState(undefined)
  const [lang, setLang] = useState(pref('lang', 'en'))
  const [dark, setDark] = useState(pref('dark', 'true') === 'true')
  const [low, setLow] = useState(pref('low', String(weak())) === 'true')
  const [choice, setChoice] = useState(() => { try { return JSON.parse(localStorage.getItem('choice')) } catch { return null } })
  const t = T[lang]

  useEffect(() => onAuthStateChanged(auth, setUser), [])
  useEffect(() => {
    const h = document.documentElement
    h.lang = lang; h.dir = lang === 'ur' ? 'rtl' : 'ltr'
    h.classList.toggle('dark', dark); h.classList.toggle('lowpower', low)
    localStorage.setItem('lang', lang); localStorage.setItem('dark', dark); localStorage.setItem('low', low)
  }, [lang, dark, low])
  const pick = c => { setChoice(c); localStorage.setItem('choice', JSON.stringify(c)) }
  const clear = () => { setChoice(null); localStorage.removeItem('choice') }

  const chip = 'glass rounded-full px-3 py-1 text-sm'
  return (
    <div className="page min-h-screen relative overflow-hidden">
      <div className="aurora"><i /><i /><i /></div>
      {!low && <Suspense fallback={null}><Background3D /></Suspense>}
      <div className="fixed top-3 inset-x-3 z-30 flex gap-2 justify-end">
        <button className={chip} onClick={() => setLang(lang === 'en' ? 'ur' : 'en')}>{lang === 'en' ? 'اردو' : 'EN'}</button>
        <button className={chip} onClick={() => setDark(!dark)} aria-label="theme">{dark ? '☀️' : '🌙'}</button>
        <button className={chip} onClick={() => setLow(!low)} aria-pressed={low}>{t.lp}: {low ? '✓' : '✗'}</button>
        {user && <button className={chip} onClick={() => { signOut(auth); clear() }}>{t.out}</button>}
      </div>
      {user === undefined ? null : !user ? <AuthPage t={t} /> : choice ? <Dashboard t={t} item={choice} onChange={clear} /> : <PathPage t={t} lang={lang} onPick={pick} />}
    </div>
  )
}
