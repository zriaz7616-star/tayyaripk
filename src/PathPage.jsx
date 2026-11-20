import { useMemo, useState } from 'react'
import { doc, setDoc } from 'firebase/firestore'
import { db, auth } from './firebase'
import { PATHS, ITEMS } from './paths'

const uniq = k => [...new Set(ITEMS.flatMap(i => i[k] || []))].sort()
const sel = 'rounded-xl px-3 py-2 bg-white/40 dark:bg-white/10 border border-white/50 dark:border-white/15 outline-none text-sm'

export default function PathPage({ t, lang, onPick }) {
  const [path, setPath] = useState('school')
  const [q, setQ] = useState('')
  const [fl, setFl] = useState({ b: '', c: '', f: '' })
  const set = k => e => setFl({ ...fl, [k]: e.target.value })
  const pool = useMemo(() => ITEMS.filter(i => i.p === path), [path])
  const opts = k => [...new Set(pool.flatMap(i => i[k] || []))].sort()
  const list = pool.filter(i =>
    i.n.toLowerCase().includes(q.toLowerCase()) &&
    (!fl.b || i.b?.includes(fl.b)) && (!fl.c || i.c?.includes(fl.c)) && (!fl.f || i.f?.includes(fl.f)))

  const choose = async item => {
    onPick(item)
    try { await setDoc(doc(db, 'users', auth.currentUser.uid), { path: { type: item.p, name: item.n } }, { merge: true }) } catch (e) {}
  }
  const switchPath = id => { setPath(id); setFl({ b: '', c: '', f: '' }) }
  const filters = [['b', t.board], ['c', t.fcity], ['f', t.field]].filter(([k]) => opts(k).length)

  return (
    <div className="relative z-10 min-h-screen px-4 pt-16 pb-10 max-w-3xl mx-auto">
      <h2 className="text-2xl font-extrabold mb-3">{t.pick}</h2>
      <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4">
        {PATHS.map(p => (
          <button key={p.id} onClick={() => switchPath(p.id)}
            className={`glass shrink-0 rounded-2xl px-4 py-3 text-sm font-bold transition ${path === p.id ? '!bg-jade !text-ink' : ''}`}>
            <span className="block text-xl">{p.icon}</span>{p[lang]}
          </button>))}
      </div>
      <div className="glass rounded-2xl p-3 mt-3 space-y-2">
        <input className={sel + ' w-full'} placeholder={t.search} value={q} onChange={e => setQ(e.target.value)} />
        {filters.length > 0 && <div className="flex gap-2 flex-wrap">
          {filters.map(([k, label]) => (
            <select key={k} className={sel} value={fl[k]} onChange={set(k)} aria-label={label}>
              <option value="">{label}: {t.all}</option>
              {opts(k).map(o => <option key={o}>{o}</option>)}
            </select>))}
        </div>}
      </div>
      <div className="grid sm:grid-cols-2 gap-3 mt-3">
        {list.map(i => (
          <button key={i.p + i.n} onClick={() => choose(i)} className="glass rounded-2xl p-4 text-start active:scale-95 transition">
            <p className="font-extrabold">{i.n}</p>
            <p className="text-xs opacity-70 mt-1">{(i.f || i.c || i.b || []).slice(0, 3).join(' · ')}</p>
          </button>))}
      </div>
      {!list.length && <p className="text-center opacity-70 mt-8">{t.none}</p>}
    </div>
  )
}

export function Dashboard({ t, item, onChange }) {
  const tiles = ['📄 ' + t.papers, '📘 ' + t.syl, '📚 ' + t.books, '⏱️ ' + t.mcq, '📈 ' + t.prog]
  return (
    <div className="relative z-10 min-h-screen px-4 pt-16 pb-10 max-w-3xl mx-auto">
      <p className="opacity-70 text-sm">{PATHS.find(p => p.id === item.p)?.en}</p>
      <h2 className="text-3xl font-extrabold">{item.n}</h2>
      <div className="grid grid-cols-2 gap-3 mt-4">
        {tiles.map(x => (
          <div key={x} className="glass rounded-2xl p-4 opacity-80">
            <p className="font-bold">{x}</p><p className="text-xs opacity-70 mt-1">{t.soon}</p>
          </div>))}
      </div>
      <button className="btn2 mt-5" onClick={onChange}>{t.change}</button>
    </div>
  )
}
