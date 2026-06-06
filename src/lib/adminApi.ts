const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? ''

export function apiUrl(path: string | null | undefined): string {
  if (!path) return ''
  if (path.startsWith('http://') || path.startsWith('https://')) return path
  return `${API_BASE}${path}`
}

type FetchAdminOptions = RequestInit & {
  query?: Record<string, string | number | boolean | undefined>
}

export class AdminApiError extends Error {
  fieldErrors: Record<string, string>

  constructor(message: string, fieldErrors: Record<string, string> = {}) {
    super(message)
    this.name = 'AdminApiError'
    this.fieldErrors = fieldErrors
  }
}

function parseFieldErrors(data: unknown): Record<string, string> {
  if (!data || typeof data !== 'object') return {}
  const obj = data as Record<string, unknown>
  const raw =
    obj.fieldErrors ??
    obj.errors ??
    obj.validationErrors ??
    (typeof obj.details === 'object' ? obj.details : undefined)

  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return {}

  const result: Record<string, string> = {}
  for (const [key, value] of Object.entries(raw as Record<string, unknown>)) {
    if (typeof value === 'string') {
      result[key] = value
    } else if (Array.isArray(value) && typeof value[0] === 'string') {
      result[key] = value[0]
    }
  }
  return result
}

function withQuery(
  path: string,
  query?: Record<string, string | number | boolean | undefined>,
): string {
  if (!query) return path
  const params = new URLSearchParams()
  for (const [key, value] of Object.entries(query)) {
    if (value !== undefined) {
      params.append(key, String(value))
    }
  }
  const qs = params.toString()
  return qs ? `${path}?${qs}` : path
}

async function fetchAdmin(path: string, options: FetchAdminOptions = {}) {
  const { query, headers, ...rest } = options
  const url = `${API_BASE}${withQuery(path, query)}`

  const response = await fetch(url, {
    ...rest,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
  })

  const text = await response.text()
  const data = text ? JSON.parse(text) : null

  if (!response.ok) {
    const message =
      data?.message ||
      data?.error ||
      (response.status ? `Request failed with status ${response.status}` : 'Request failed')
    throw new AdminApiError(message, parseFieldErrors(data))
  }

  return data
}

// TYPES

export type DoctorOnboardingStatus =
  | 'INVITED'
  | 'DOCUMENTS_PENDING'
  | 'VERIFIED'
  | 'ACTIVE'
  | 'SUSPENDED'

export type Doctor = {
  id: number
  userId?: number
  name: string
  email: string
  specialty: string | null
  licenseNumber: string | null
  phone: string | null
  isActive: boolean
  _count?: { treatmentRequests?: number }
  title: string | null
  bsnrNumber: string | null
  lanrNumber: string | null
  medicalChamber: string | null
  languages: string[]
  onboardingStatus: DoctorOnboardingStatus
  consultationFee: number | null
  bio: string | null
  profilePictureUrl: string | null
  yearsOfExperience: number | null
  availableForCannabis: boolean
  createdAt?: string
  treatmentRequests?: Array<{
    id: number
    status: string
    createdAt: string
    patient: { id: number; email: string; fullName: string }
    pharmacy: { id: number; name: string } | null
  }>
}

export type PatientListRow = {
  id: number
  fullName: string
  email: string
  phone?: string | null
  createdAt: string
  _count?: { treatmentRequests?: number }
}

export type PatientOrderItem = {
  productId: number
  productName: string
  quantity: number
  pricePerUnit: number
}

export type PatientOrderSummary = {
  id: number
  status: string
  createdAt: string
  deliveryMethod: string | null
  deliveryAddress: string | null
  total: number
  pharmacyName: string | null
  productCount: number
  items?: PatientOrderItem[]
}

export type PatientUpdatePayload = {
  fullName?: string
  email?: string
  phone?: string
  city?: string
  street?: string
  zip?: string
  dateOfBirth?: string | null
}

export type PatientDetail = {
  id: number
  email: string
  name: string | null
  fullName?: string | null
  phone: string | null
  address: string | null
  city?: string | null
  street?: string | null
  zip?: string | null
  dateOfBirth?: string | null
  treatmentRequests: Array<{
    id: number
    status: string
    createdAt: string
    doctor: { name: string | null }
    pharmacy: { name: string | null }
  }>
  orders?: PatientOrderSummary[]
}

export type PharmacyStats = {
  totalOrders: number
  totalRevenue: number
  avgFulfillmentMinutes: number | null
  ordersThisMonth: number
  activeOrders: number
}

export type PharmacyProduct = {
  id: number
  name: string
  strain: string | null
  thcContent: number | null
  cbdContent: number | null
  pricePerGram: number
  stockGrams: number
  isActive: boolean
  cannaleoExternalId: string | null
}

export type PharmacyUpdatePayload = {
  name?: string
  email?: string
  contact?: string
  phone?: string
  zip?: string
  city?: string
  cannaleoSubdomain?: string | null
  cannaleoVendorId?: string | null
  cannaleoApiKey?: string | null
  inventorySource?: 'MANUAL' | 'CANNALEO'
  supportsBotendienst?: boolean
  supportsPickup?: boolean
  supportsMailOrder?: boolean
  mailOrderFee?: number | null
  // Profile fields editable by admin
  description?: string | null
  logoUrl?: string | null
  operatingHours?: string | null
  contactPersonName?: string | null
  contactEmail?: string | null
  apothekenLizenz?: string | null
  btmErlaubnis?: string | null
}

export type PharmacyDetail = {
  id: number
  name: string
  email: string
  contact: string
  phone?: string | null
  zip: string
  city?: string
  street?: string | null
  latitude?: number | null
  longitude?: number | null
  deliveryType: string
  inventorySource?: 'MANUAL' | 'CANNALEO' | string
  cannaleoSubdomain?: string | null
  cannaleoVendorId?: string | null
  cannaleoApiKey?: string | null
  supportsBotendienst?: boolean
  supportsPickup?: boolean
  supportsMailOrder?: boolean
  mailOrderFee?: number | null
  baseDeliveryFee?: number | null
  extendedDeliveryFee?: number | null
  deliveryRadius?: number | null
  maxDeliveryRadius?: number | null
  // Profile fields
  description?: string | null
  logoUrl?: string | null
  operatingHours?: string | null
  contactPersonName?: string | null
  contactEmail?: string | null
  apothekenLizenz?: string | null
  btmErlaubnis?: string | null
  apiKey?: string | null
  _count?: { treatmentRequests: number; products: number }
  recentTreatmentRequests?: Array<{
    id: number
    status: string
    createdAt: string
    patient: { id: number; email: string; fullName: string }
  }>
  stats?: PharmacyStats
  products?: PharmacyProduct[]
}

export type PrescriptionListRow = {
  id: number
  createdAt: string
  status: string
  patientName: string | null
  patientId: number | null
  doctorName: string | null
  pharmacyName: string | null
  pdfUrl: string | null
  email?: string | null
  totalPrice?: number | null
}

export type CreateDoctorPayload = {
  name: string
  email: string
  licenseNumber?: string
  specialty?: string
  title?: string | null
  phone?: string | null
  profilePictureUrl?: string | null
  bsnrNumber?: string | null
  lanrNumber?: string | null
  medicalChamber?: string | null
  languages?: string[]
  yearsOfExperience?: number | null
  consultationFee?: number | null
  availableForCannabis?: boolean
  bio?: string | null
  onboardingStatus?: DoctorOnboardingStatus
}

// AUTH
export async function adminLogin(email: string): Promise<{ message: string }> {
  return fetchAdmin('/api/admin/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email }),
  })
}

export async function adminVerify(
  email: string,
  otp: string,
): Promise<{
  message: string
  admin: { id: number; email: string; name: string; role: string }
}> {
  return fetchAdmin('/api/admin/auth/verify', {
    method: 'POST',
    body: JSON.stringify({ email, otp }),
  })
}

export async function adminLogout(): Promise<void> {
  await fetchAdmin('/api/admin/auth/logout', {
    method: 'POST',
  })
}

export async function adminMe(): Promise<{
  id: number
  email: string
  name: string
  role: string
  isActive: boolean
}> {
  return fetchAdmin('/api/admin/auth/me')
}

// PATIENTS
export async function getAdminPatients(params?: {
  page?: number
  limit?: number
  search?: string
}): Promise<{
  patients: PatientListRow[]
  total: number
  page: number
  limit: number
  totalPages: number
}> {
  return fetchAdmin('/api/admin/patients', {
    query: params,
  })
}

export async function getAdminPatient(id: number): Promise<PatientDetail> {
  return fetchAdmin(`/api/admin/patients/${id}`)
}

export async function updatePatient(
  id: number,
  payload: PatientUpdatePayload,
): Promise<PatientDetail> {
  return fetchAdmin(`/api/admin/patients/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  })
}

// DOCTORS
export async function getAdminDoctors(params?: {
  page?: number
  limit?: number
  search?: string
}): Promise<{
  doctors: Doctor[]
  total: number
  page: number
  limit: number
  totalPages: number
}> {
  return fetchAdmin('/api/admin/doctors', {
    query: params,
  })
}

export async function getAdminDoctor(id: number): Promise<Doctor> {
  return fetchAdmin(`/api/admin/doctors/${id}`)
}

export async function toggleDoctorActive(id: number, isActive: boolean): Promise<Doctor> {
  return fetchAdmin(`/api/admin/doctors/${id}/active`, {
    method: 'PATCH',
    body: JSON.stringify({ isActive }),
  })
}

export async function createDoctor(data: CreateDoctorPayload): Promise<Doctor> {
  return fetchAdmin('/api/admin/doctors', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export async function updateDoctor(id: number, payload: Partial<Doctor>): Promise<Doctor> {
  return fetchAdmin(`/api/admin/doctors/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  })
}

// PHARMACIES
export async function getAdminPharmacies(params?: {
  page?: number
  limit?: number
  search?: string
}): Promise<{
  pharmacies: unknown[]
  total: number
  page: number
  limit: number
  totalPages: number
}> {
  return fetchAdmin('/api/admin/pharmacies', {
    query: params,
  })
}

export async function getAdminPharmacy(id: number): Promise<PharmacyDetail> {
  return fetchAdmin(`/api/admin/pharmacies/${id}`)
}

export async function updatePharmacy(
  id: number,
  payload: PharmacyUpdatePayload,
): Promise<PharmacyDetail> {
  return fetchAdmin(`/api/admin/pharmacies/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  })
}

export async function updatePharmacyDelivery(
  id: number,
  data: {
    deliveryType?: string
    deliveryRadius?: number
    baseDeliveryFee?: number
    extendedDeliveryFee?: number
    maxDeliveryRadius?: number
  },
): Promise<unknown> {
  return fetchAdmin(`/api/admin/pharmacies/${id}/delivery`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  })
}
export async function createPharmacy(data: {
  name: string
  email: string
  contact: string
  phone?: string
  address?: string
  zip: string
  city?: string
  deliveryType?: string
  cannaleoSubdomain?: string
  cannaleoVendorId?: string
  cannaleoApiKey?: string
  supportsBotendienst?: boolean
  supportsPickup?: boolean
  supportsMailOrder?: boolean
  mailOrderFee?: number
}): Promise<unknown> {
  return fetchAdmin('/api/admin/pharmacies', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export async function syncCannaleoPharmacy(id: number): Promise<{
  message: string
  synced: number
  errors: string[]
}> {
  return fetchAdmin(`/api/admin/pharmacies/${id}/sync-cannaleo`, {
    method: 'POST',
  })
}

// PRESCRIPTIONS
export async function getAdminPrescriptions(params?: {
  page?: number
  limit?: number
  search?: string
  status?: string
}): Promise<{
  prescriptions: PrescriptionListRow[]
  total: number
  page: number
  limit: number
  totalPages: number
}> {
  return fetchAdmin('/api/admin/prescriptions', {
    query: params,
  })
}

export async function getAdminPrescription(id: number): Promise<unknown> {
  return fetchAdmin(`/api/admin/prescriptions/${id}`)
}

export async function updatePrescriptionStatus(id: number, status: string): Promise<unknown> {
  return fetchAdmin(`/api/admin/prescriptions/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  })
}

// TEAM
export async function getAdminTeam(params?: {
  page?: number
  limit?: number
}): Promise<{
  members: unknown[]
  total: number
  page: number
  limit: number
  totalPages: number
}> {
  return fetchAdmin('/api/admin/team', {
    query: params,
  })
}

export async function createAdminMember(data: {
  email: string
  name: string
  role: string
}): Promise<unknown> {
  return fetchAdmin('/api/admin/team', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export async function updateAdminMember(
  id: number,
  data: {
    name?: string
    role?: string
    isActive?: boolean
  },
): Promise<unknown> {
  return fetchAdmin(`/api/admin/team/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  })
}

export async function deactivateAdminMember(id: number): Promise<unknown> {
  return fetchAdmin(`/api/admin/team/${id}`, {
    method: 'DELETE',
  })
}

// ANALYTICS
export type AnalyticsOverview = {
  totalPatients?: number
  totalDoctors?: number
  totalPharmacies?: number
  totalTreatmentRequests?: number
  totalPrescriptions?: number
  pendingApproval?: number
  todayRequests?: number
  totalRevenue?: number
  activeDoctors?: number
}

export type RecentActivityItem = {
  id?: number | string
  treatmentRequestId?: number | string
  fullName?: string
  patientName?: string
  patient?: { name?: string; fullName?: string }
  status?: string
  doctorName?: string
  doctor?: { name?: string }
  pharmacyName?: string
  pharmacy?: { name?: string }
  createdAt?: string
  date?: string
  amount?: number
  total?: number
  paymentAmount?: number
}

export async function getAnalyticsOverview(): Promise<AnalyticsOverview> {
  const res = await fetchAdmin('/api/admin/analytics/overview')
  const cast = res as Record<string, unknown>
  return (cast?.data ?? cast ?? {}) as AnalyticsOverview
}

export async function getRequestsByStatus(): Promise<
  Array<{ status: string; count: number }>
> {
  const res = await fetchAdmin('/api/admin/analytics/requests-by-status')
  const cast = res as Record<string, unknown>
  const inner = cast?.data ?? cast?.rows ?? cast?.byStatus ?? cast

  if (Array.isArray(inner)) {
    return inner as Array<{ status: string; count: number }>
  }
  if (inner && typeof inner === 'object' && !Array.isArray(inner)) {
    return Object.entries(inner as Record<string, number>).map(([status, count]) => ({
      status,
      count: typeof count === 'number' ? count : Number(count),
    }))
  }
  return []
}

export async function getRecentActivity(): Promise<RecentActivityItem[]> {
  const res = await fetchAdmin('/api/admin/analytics/recent-activity')
  const cast = res as Record<string, unknown>
  const raw =
    cast?.activity ??
    cast?.data ??
    cast?.activities ??
    cast?.requests ??
    (Array.isArray(cast) ? cast : [])

  return Array.isArray(raw) ? (raw as RecentActivityItem[]) : []
}
