import { useState } from 'react'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, sendPasswordResetEmail } from 'firebase/auth'
import { doc, setDoc, getDoc } from 'firebase/firestore'
import { auth, db, google } from './firebase'

const CLASSES = ['8', '9', '10', 'O Level', '11', '12', 'A Level', 'FSc/FA/ICS/ICom', 'University', 'Other']

export default function AuthPage({ t }) {
  const [signup, setSignup] = useState(false)
  const [f, setF] = useState({ email: '', pass: '', name: '', cls: '10', city: '', goal: '' })
  const [msg, setMsg] = useState('')
  const set = k => e => setF({ ...f, [k]: e.target.value })
  const run = fn => async () => { setMsg(''); try { await fn() } catch (e) { setMsg(e.code?.replace('auth/', '').replace(/-/g, ' ') || 'Error') } }

  const submit = run(async () => {
    if (!signup) return signInWithEmailAndPassword(auth, f.email, f.pass)
    const { user } = await createUserWithEmailAndPassword(auth, f.email, f.pass)
    await setDoc(doc(db, 'users', user.uid), { name: f.name, class: f.cls, city: f.city, goal: f.goal, createdAt: Date.now() })
  })
  const withGoogle = run(async () => {
    const { user } = await signInWithPopup(auth, google)
    const ref = doc(db, 'users', user.uid)
    if (!(await getDoc(ref)).exists()) await setDoc(ref, { name: user.displayName || '', class: '', city: '', goal: '', createdAt: Date.now() })
  })
  const reset = run(async () => { await sendPasswordResetEmail(auth, f.email); setMsg(t.sent) })

  return (
    <div className="relative z-10 min-h-screen grid place-items-center p-4">
      <div className="glass rounded-3xl p-6 w-full max-w-sm space-y-3">
        <h1 className="text-3xl font-extrabold">{t.app}</h1>
        <p className="opacity-70 -mt-2">{t.tag}</p>
        {signup && <input className="field" placeholder={t.name} value={f.name} onChange={set('name')} />}
        <input className="field" type="email" inputMode="email" placeholder={t.email} value={f.email} onChange={set('email')} />
        <input className="field" type="password" placeholder={t.pass} value={f.pass} onChange={set('pass')} />
        {signup && <>
          <select className="field" value={f.cls} onChange={set('cls')} aria-label={t.cls}>{CLASSES.map(c => <option key={c}>{c}</option>)}</select>
          <input className="field" placeholder={t.city} value={f.city} onChange={set('city')} />
          <input className="field" placeholder={t.goal} value={f.goal} onChange={set('goal')} />
        </>}
        <button className="btn" onClick={submit}>{signup ? t.signup : t.signin}</button>
        <button className="btn !bg-white/70 dark:!bg-white/15 dark:!text-white" onClick={withGoogle}>{t.google}</button>
        {!signup && <button className="text-sm underline" onClick={reset}>{t.forgot}</button>}
        {msg && <p role="alert" className="text-sm text-saffron">{msg}</p>}
        <button className="block text-sm underline" onClick={() => setSignup(!signup)}>{signup ? t.have : t.none}</button>
      </div>
    </div>
  )
}
