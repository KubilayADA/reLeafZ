'use client'

import React from 'react'
import './footer.css'

const FOOTER_LINK_HREFS: Record<string, string> = {
  'How it Works': '#faq',
  Community: 'https://www.instagram.com/releafz.hq/',
  'For Doctors': '/partners',
  'For Pharmacies': '/pharmacies',
  'Partner with Us': 'mailto:kubilay.ada@releafz.de',
  'Privacy Policy': '/datenschutz',
  'Terms of Service': '/agb',
  'GDPR Compliance': '/datenschutz',
  Datenlöschung: '/datenloeschung',
}

const FOOTER_LINK_GROUPS = [
  {
    title: 'For Patients',
    links: ['How it Works', 'Community'],
  },
  {
    title: 'For Professionals',
    links: ['For Doctors', 'For Pharmacies', 'Partner with Us'],
  },
  {
    title: 'Legal & Support',
    links: ['Privacy Policy', 'Terms of Service', 'GDPR Compliance', 'Datenlöschung', 'Support'],
  },
]

const FooterLogo = () => (
  <img
    src="/logo1.png"
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
            Germany&apos;s fastest and safest platform for telemedical cannabis care.
          </p>
        </div>

        {FOOTER_LINK_GROUPS.map((group) => (
          <div key={group.title} className="footer__group">
            <h4 className="footer__group-title">{group.title}</h4>
            <ul className="footer__links">
              {group.links.map((label) => (
                <li key={label}>
                  <a href={FOOTER_LINK_HREFS[label] ?? '#'} className="footer__link">
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="footer__bottom">
        <p>© 2026 reLeafZ (SC CODE UG). Software- und Vermittlungsplattform für telemedizinische Versorgung. reLeafZ ist keine Apotheke und kein Arzneimittelhändler — Arzneimittel werden ausschließlich durch zugelassene Apotheken abgegeben.</p>
      </div>
    </footer>
  )
}
