'use client'

import React from 'react'
import './footer.css'

const FOOTER_LINK_GROUPS = [
  {
    title: 'For Patients',
    links: ['How it Works', 'Strain Library', 'Treatment Tracking', 'Community'],
  },
  {
    title: 'For Professionals',
    links: ['For Doctors', 'For Pharmacies', 'Partner with Us'],
  },
  {
    title: 'Legal & Support',
    links: ['Privacy Policy', 'Terms of Service', 'GDPR Compliance', 'Support'],
  },
]

const FooterLogo = () => (
  <img
    src="/logo2.png"
    alt="reLeafZ Logo"
    className="footer__logo"
  />
)

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__inner">
        <div className="footer__brand">
          <FooterLogo />
          <p className="footer__tagline">
            Germany&apos;s fastest, safest, and coolest medical cannabis platform.
          </p>
        </div>

        {FOOTER_LINK_GROUPS.map((group) => (
          <div key={group.title} className="footer__group">
            <h4 className="footer__group-title">{group.title}</h4>
            <ul className="footer__links">
              {group.links.map((label) => (
                <li key={label}>
                  <a href="#" className="footer__link">
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="footer__bottom">
        <p>© 2026 reLeafZ. All rights reserved. Licensed medical cannabis platform serving Berlin.</p>
      </div>
    </footer>
  )
}
