import { Canvas, useFrame } from '@react-three/fiber'
import { useRef } from 'react'
const COLORS = ['#19c48a', '#ffb534', '#6c7bff', '#ff6b8b']
const books = Array.from({ length: 14 }, (_, i) => ({ x: (Math.random() - .5) * 9, y: (Math.random() - .5) * 14, z: -Math.random() * 5, s: .5 + Math.random() * .6, c: COLORS[i % 4], sp: .2 + Math.random() * .5 }))
function Book({ b }) {
  const r = useRef()
  useFrame(({ clock, pointer, viewport }, d) => {
    const t = clock.elapsedTime * b.sp
    r.current.rotation.x += d * .3; r.current.rotation.y += d * .4
    r.current.position.y = b.y + Math.sin(t) * .4
    r.current.position.x += (b.x + pointer.x * b.s * 1.5 - r.current.position.x) * .05
  })
  return <mesh ref={r} position={[b.x, b.y, b.z]} scale={b.s}><boxGeometry args={[.9, 1.2, .25]} /><meshStandardMaterial color={b.c} roughness={.5} /></mesh>
}
export default function Background3D() {
  return (
    <Canvas className="!fixed inset-0 -z-0" dpr={1} gl={{ antialias: false, powerPreference: 'low-power' }} camera={{ position: [0, 0, 6], fov: 55 }}>
      <ambientLight intensity={.8} /><directionalLight position={[3, 4, 5]} intensity={1.2} />
      {books.map((b, i) => <Book key={i} b={b} />)}
    </Canvas>
  )
}
