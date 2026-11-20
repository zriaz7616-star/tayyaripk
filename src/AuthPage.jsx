import { useState } from 'react'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, sendPasswordResetEmail } from 'firebase/auth'
import { doc, setDoc, getDoc } from 'firebase/firestore'
import { auth, db, google } from './firebase'

const CLASSES = ['8', '9', '10', 'O Level', '11', '12', 'A Level', 'FSc/FA/ICS/ICom', 'University', 'Other']
const box = 'peer w-full rounded-2xl bg-white/40 dark:bg-white/10 px-4 pt-6 pb-2 outline-none border border-white/50 dark:border-white/15 focus:border-jade focus:shadow-[0_0_0_4px_rgba(25,196,138,.22)] transition'

function Field({ id, label, type = 'text', mode, value, onChange }) {
  return (
    <div className="relative">
      <input id={id} type={type} inputMode={mode} placeholder=" " value={value} onChange={onChange} className={box} />
      <label htmlFor={id} className="pointer-events-none absolute start-4 top-1 text-xs opacity-70 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-focus:top-1 peer-focus:text-xs">{label}</label>
    </div>)
}

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
  const tab = on => `relative z-10 py-2.5 transition-colors ${on ? 'text-ink' : 'opacity-70'}`

  return (
    <div className="relative z-10 min-h-screen grid place-items-center p-4 pt-16">
      <div className="ring w-full max-w-sm">
        <div className="inner glass p-6 space-y-3">
          <div className="text-center pb-1">
            <h1 className="text-4xl font-extrabold bg-gradient-to-r from-jade via-indigo-400 to-saffron bg-clip-text text-transparent">{t.app}</h1>
            <p className="opacity-70 text-sm">{t.tag}</p>
          </div>
          <div className="relative grid grid-cols-2 rounded-full bg-white/30 dark:bg-white/10 p-1 text-sm font-extrabold">
            <i className={`thumb absolute top-1 bottom-1 start-1 w-[calc(50%-4px)] rounded-full bg-jade shadow transition-transform duration-300 ${signup ? 'on' : ''}`} />
            <button className={tab(!signup)} onClick={() => setSignup(false)}>{t.signin}</button>
            <button className={tab(signup)} onClick={() => setSignup(true)}>{t.signup}</button>
          </div>
          {signup && <Field id="n" label={t.name} value={f.name} onChange={set('name')} />}
          <Field id="e" label={t.email} type="email" mode="email" value={f.email} onChange={set('email')} />
          <Field id="p" label={t.pass} type="password" value={f.pass} onChange={set('pass')} />
          {signup && <>
            <div className="relative">
              <select id="c" className={box} value={f.cls} onChange={set('cls')}>{CLASSES.map(c => <option key={c}>{c}</option>)}</select>
              <label htmlFor="c" className="pointer-events-none absolute start-4 top-1 text-xs opacity-70">{t.cls}</label>
            </div>
            <Field id="ci" label={t.city} value={f.city} onChange={set('city')} />
            <Field id="g" label={t.goal} value={f.goal} onChange={set('goal')} />
          </>}
          <button className="btn" onClick={submit}>{signup ? t.signup : t.signin}</button>
          <button className="btn2" onClick={withGoogle}>G &nbsp;{t.google}</button>
          {!signup && <button className="text-sm underline block mx-auto" onClick={reset}>{t.forgot}</button>}
          {msg && <p role="alert" className="text-sm text-center text-amber-500 font-bold">{msg}</p>}
        </div>
      </div>
    </div>
  )
}
