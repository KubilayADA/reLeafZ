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
  Datenlöschung:
    'mailto:support@releafz.de?subject=L%C3%B6schung%20meines%20Kontos%20(Art.%2017%20DSGVO)&body=Hallo%2C%0A%0Aich%20m%C3%B6chte%20die%20L%C3%B6schung%20meines%20Kontos%20und%20meiner%20personenbezogenen%20Daten%20gem%C3%A4%C3%9F%20Art.%2017%20DSGVO%20beantragen.%0A%0AMeine%20bei%20releafZ%20registrierte%20E-Mail-Adresse%3A%20',
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
            Germany&apos;s fastest, safest, and coolest medical cannabis platform.
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
        <p>© 2026 reLeafZ. All rights reserved. Licensed medical cannabis platform serving Berlin.</p>
      </div>
    </footer>
  )
}
