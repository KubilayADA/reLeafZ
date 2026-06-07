'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import StepProgress from '@/form/step-progress'
import FormLogoHomeExit from '@/form/form-logo-home-exit'
import '@/form/form.css'

interface Step8FormData {
  consultationType: string
  condition: string
  onset: string
  frequency: string
  severity: string
  diagnosisText: string
  hasSeenDoctor: boolean | null
  treatmentLocations: string[]
  hasTakenMedication: boolean | null
  medicationDetails: string
  nonMedicalTherapies: string[]
  isPregnantOrBreastfeeding: boolean | null
  exceededMonthlyLimit: boolean | null
  preExistingConditions: string[]
  previousCannabisExperience: boolean | null
  hadSideEffects: boolean | null
  treatmentExpectations: string[]
}

interface Step8Props {
  formData: Step8FormData
  onSubmit: () => void
  onBack?: () => void
  onEditStep: (stepNumber: number) => void
  submitting?: boolean
}

const consultationLabels: Record<string, string> = {
  questionnaire: 'Online-Fragebogen',
  video: 'Video-Sprechstunde',
  onsite: 'Vor-Ort-Termin',
}

const conditionLabels: Record<string, string> = {
  'sleep-disorder': 'Schlafstörung',
  'chronic-pain': 'Chronische Schmerzen',
  adhd: 'ADHS',
  migraine: 'Migräne',
}

const onsetLabels: Record<string, string> = {
  'more-than-3-months': 'Vor mehr als 3 Monaten',
  'less-than-3-months': 'Vor weniger als 3 Monaten',
}

const frequencyLabels: Record<string, string> = {
  always: 'Ständig',
  often: 'Oft',
  never: 'Nie',
}

const severityLabels: Record<string, string> = {
  'sehr-leicht': 'Sehr leicht',
  leicht: 'Leicht',
  mittel: 'Mittel',
  stark: 'Stark',
  'sehr-stark': 'Sehr stark',
}

const preExistingConditionLabels: Record<string, string> = {
  Psychose: 'Psychose oder Schizophrenie',
  Persoenlichkeitsstoerung: 'Persönlichkeitsstörung',
  Sucht: 'Suchterkrankung',
  Herzkrankheit: 'Schwere Herzerkrankung',
  LeberNierenkrankheit: 'Leber- oder Nierenerkrankung',
  THCAllergie: 'THC-Allergie',
  Keine: 'Keine Vorerkrankungen',
}

const treatmentExpectationLabels: Record<string, string> = {
  Lebensqualitaet: 'Bessere Lebensqualität',
  SymptomLinderung: 'Linderung meiner Symptome',
  Funktionalitaet: 'Bessere Funktionalität im Alltag',
  Alltagsbewaeltigung: 'Bessere Alltagsbewältigung',
  Arbeitsfaehigkeit: 'Erhalt meiner Arbeitsfähigkeit',
  SozialesLeben: 'Verbesserung meines sozialen Lebens',
  BasismedikationReduktion: 'Reduktion meiner Basismedikation',
  NebenwirkungenReduzieren: 'Reduktion von Nebenwirkungen anderer Medikamente',
}

function displayBool(value: boolean | null): string {
  if (value === null) return '—'
  return value ? 'Ja' : 'Nein'
}

function displayStr(value: string): string {
  return value.trim() || '—'
}

function displayArr(arr: string[], labelMap: Record<string, string>): string {
  if (arr.length === 0) return '—'
  return arr.map((v) => labelMap[v] ?? v).join(', ')
}

function displayLabel(value: string, labelMap: Record<string, string>): string {
  return labelMap[value] ?? displayStr(value)
}

function truncate(value: string, maxLen = 80): string {
  if (value.length <= maxLen) return value
  return value.slice(0, maxLen) + '…'
}

export default function Step8({ formData, onSubmit, onBack, onEditStep, submitting = false }: Step8Props) {
  return (
    <div className="form-page form-page--step4-fit inconsolata">
      <FormLogoHomeExit />
      <div className="form-container form-container--step4-fit">
        {onBack && (
          <div className="form-header__back-wrap">
            <Button onClick={onBack} disabled={submitting} className="btn-outline form-back-button text-sm sm:text-base">
              <ArrowLeft className="form-back-icon" />
              Zurück
            </Button>
          </div>
        )}

        <div className="form-card form-card--rounded-lg form-card--step4-fit">
          <h2 className="form-section-title">
            Zusammenfassung
          </h2>
          <p className="form-section-hint">
            Bitte überprüfe deine Angaben vor dem Absenden.
          </p>

          <div className="form-step4-sections form-step4-sections--fit">
            <ReviewSection title="Schritt 1 — Behandlungsart" stepNumber={1} onEditStep={onEditStep} submitting={submitting}>
              <ReviewRow label="Behandlungsart" value={displayLabel(formData.consultationType, consultationLabels)} />
            </ReviewSection>

            <ReviewSection title="Schritt 3 — Erkrankung" stepNumber={3} onEditStep={onEditStep} submitting={submitting}>
              <ReviewRow label="Beschwerde" value={displayLabel(formData.condition, conditionLabels)} />
            </ReviewSection>

            <ReviewSection title="Schritt 4 — Symptome" stepNumber={4} onEditStep={onEditStep} submitting={submitting}>
              <ReviewRow label="Symptombeginn" value={displayLabel(formData.onset, onsetLabels)} />
              <ReviewRow label="Häufigkeit" value={displayLabel(formData.frequency, frequencyLabels)} />
              <ReviewRow label="Schweregrad" value={displayLabel(formData.severity, severityLabels)} />
              <ReviewRow
                label="Diagnose / ICD"
                value={displayStr(formData.diagnosisText)}
                fullText={formData.diagnosisText}
                truncated
              />
            </ReviewSection>

            <ReviewSection title="Schritt 5 — Vorherige Behandlung" stepNumber={5} onEditStep={onEditStep} submitting={submitting}>
              <ReviewRow label="Arztbesuch" value={displayBool(formData.hasSeenDoctor)} />
              {formData.hasSeenDoctor === true && (
                <ReviewRow label="Behandlungsorte" value={displayArr(formData.treatmentLocations, {})} />
              )}
              <ReviewRow label="Medikamente eingenommen" value={displayBool(formData.hasTakenMedication)} />
              {formData.hasTakenMedication === true && (
                <ReviewRow
                  label="Medikamentendetails"
                  value={displayStr(formData.medicationDetails)}
                  fullText={formData.medicationDetails}
                  truncated
                />
              )}
              <ReviewRow label="Nicht-medikamentöse Therapien" value={displayArr(formData.nonMedicalTherapies, {})} />
            </ReviewSection>

            <ReviewSection title="Schritt 6 — Ausschlusskriterien" stepNumber={6} onEditStep={onEditStep} submitting={submitting}>
              <ReviewRow label="Schwanger / stillend" value={displayBool(formData.isPregnantOrBreastfeeding)} />
              <ReviewRow label="Monatslimit überschritten" value={displayBool(formData.exceededMonthlyLimit)} />
              <ReviewRow label="Vorerkrankungen" value={displayArr(formData.preExistingConditions, preExistingConditionLabels)} />
            </ReviewSection>

            <ReviewSection title="Schritt 7 — Cannabis Erfahrung" stepNumber={7} onEditStep={onEditStep} submitting={submitting}>
              <ReviewRow label="Cannabis-Erfahrung" value={displayBool(formData.previousCannabisExperience)} />
              {formData.previousCannabisExperience === true && (
                <ReviewRow label="Nebenwirkungen" value={displayBool(formData.hadSideEffects)} />
              )}
              <ReviewRow label="Therapieziele" value={displayArr(formData.treatmentExpectations, treatmentExpectationLabels)} />
            </ReviewSection>
          </div>

          <Button
            onClick={onSubmit}
            disabled={submitting}
            className="form-cta btn-secondary form-step4-cta form-cta--step4-fit"
          >
            {submitting ? 'Wird gesendet...' : 'Anfrage absenden'}
          </Button>
        </div>
        <StepProgress currentStep={8} totalSteps={8} />
      </div>
    </div>
  )
}

interface ReviewSectionProps {
  title: string
  stepNumber: number
  onEditStep: (n: number) => void
  submitting: boolean
  children: React.ReactNode
}

function ReviewSection({ title, stepNumber, onEditStep, submitting, children }: ReviewSectionProps) {
  return (
    <section
      className="form-step4-section form-step4-section--fit"
      style={{ borderBottom: '1px solid rgba(0,0,0,0.07)', paddingBottom: '1rem', marginBottom: '0.5rem' }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
        <h3 className="form-section-title" style={{ margin: 0 }}>
          {title}
        </h3>
        <button
          type="button"
          onClick={() => onEditStep(stepNumber)}
          disabled={submitting}
          className="btn-outline form-back-button text-sm"
          style={{ padding: '0.125rem 0.625rem', fontSize: '0.75rem' }}
        >
          Bearbeiten
        </button>
      </div>
      <div>{children}</div>
    </section>
  )
}

interface ReviewRowProps {
  label: string
  value: string
  fullText?: string
  truncated?: boolean
}

function ReviewRow({ label, value, fullText, truncated = false }: ReviewRowProps) {
  const displayValue = truncated && fullText ? truncate(fullText) : value
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        padding: '0.2rem 0',
        gap: '1rem',
      }}
    >
      <span className="form-section-hint" style={{ margin: 0, flexShrink: 0 }}>
        {label}
      </span>
      <span
        title={fullText && fullText.length > 80 ? fullText : undefined}
        style={{ textAlign: 'right', wordBreak: 'break-word' }}
      >
        {displayValue}
      </span>
    </div>
  )
}
