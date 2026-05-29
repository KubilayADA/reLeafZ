'use client'
import React, { useState, useRef, useEffect } from 'react'
import '@/app/main.css'
import './faq.css'
import SectionParticlesBackground from '@/components/ui/SectionParticlesBackground'
import { faqDe } from '@/content/faq/de'

interface AccordionItemProps {
  question: string
  answer: string
  isOpen: boolean
  onToggle: () => void
}

function AccordionItem({ question, answer, isOpen, onToggle }: AccordionItemProps): React.JSX.Element {
  const bodyRef = useRef<HTMLDivElement | null>(null)
  const [height, setHeight] = useState<number>(0)

  useEffect(() => {
    if (!bodyRef.current) return
    setHeight(isOpen ? bodyRef.current.scrollHeight : 0)
  }, [isOpen])

  return (
    <div className={`faq-item ${isOpen ? 'faq-item--open' : ''}`}>
      <button
        type="button"
        className="faq-item__trigger"
        onClick={onToggle}
        aria-expanded={isOpen}
      >
        <span className="faq-item__question">{question}</span>
        <span className="faq-item__icon" aria-hidden>
          <span className="faq-item__icon-bar faq-item__icon-bar--h" />
          <span className="faq-item__icon-bar faq-item__icon-bar--v" />
        </span>
      </button>
      <div
        className="faq-item__body"
        style={{ height }}
        aria-hidden={!isOpen}
      >
        <div ref={bodyRef} className="faq-item__answer">
          {answer}
        </div>
      </div>
    </div>
  )
}

export default function Faq(): React.JSX.Element {
  const [openIdx, setOpenIdx] = useState<number | null>(null)
  const content = faqDe

  const toggle = (idx: number) => {
    setOpenIdx((prev) => (prev === idx ? null : idx))
  }

  return (
    <section
      id="faq"
      className="faq-section"
      aria-label="Häufige Fragen"
    >
      <div className="faq__bg" aria-hidden>
        <div className="faq__bg-base" />
        <SectionParticlesBackground className="faq__particles" />
        <div className="faq__glow-radial" />
        <div className="faq__grid" />
      </div>

      <div className="faq__shell">
        <div className="faq-inner">
          <div className="faq-heading">
            <p className="faq-kicker">{content.eyebrow}</p>
            <h2>{content.title}</h2>
          </div>

          <div className="faq-list" role="list">
            {content.items.map((item, idx) => (
              <AccordionItem
                key={item.id}
                question={item.question}
                answer={item.answer}
                isOpen={openIdx === idx}
                onToggle={() => toggle(idx)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
