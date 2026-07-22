import { useEffect, useState } from 'react'
import logo from '../assets/logo.png'

export default function BrandSplash() {
  const [visible, setVisible] = useState(true)
  const [leaving, setLeaving] = useState(false)

  useEffect(() => {
    const leaveTimer = window.setTimeout(() => setLeaving(true), 1400)
    const hideTimer = window.setTimeout(() => setVisible(false), 1950)
    return () => { window.clearTimeout(leaveTimer); window.clearTimeout(hideTimer) }
  }, [])

  if (!visible) return null
  return (
    <div className={`brand-splash ${leaving ? 'brand-splash-leaving' : ''}`} aria-label="First Loc DZ">
      <div className="brand-splash-glow" />
      <div className="brand-splash-content">
        <img src={logo} alt="Logo First Loc DZ" className="brand-splash-logo" />
        <p className="brand-splash-name">First Loc <span>DZ</span></p>
        <p className="brand-splash-tagline">Location de voiture</p>
        <span className="brand-splash-line" />
      </div>
    </div>
  )
}
