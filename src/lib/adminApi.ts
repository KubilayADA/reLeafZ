const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? ''

type FetchAdminOptions = RequestInit & {
  query?: Record<string, string | number | boolean | undefined>
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
    throw new Error(message)
  }

  return data
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
  patients: unknown[]
  total: number
  page: number
  limit: number
  totalPages: number
}> {
  return fetchAdmin('/api/admin/patients', {
    query: params,
  })
}

export async function getAdminPatient(id: number): Promise<unknown> {
  return fetchAdmin(`/api/admin/patients/${id}`)
}

// DOCTORS
export async function getAdminDoctors(params?: {
  page?: number
  limit?: number
  search?: string
}): Promise<{
  doctors: unknown[]
  total: number
  page: number
  limit: number
  totalPages: number
}> {
  return fetchAdmin('/api/admin/doctors', {
    query: params,
  })
}

export async function getAdminDoctor(id: number): Promise<unknown> {
  return fetchAdmin(`/api/admin/doctors/${id}`)
}

export async function toggleDoctorActive(id: number, isActive: boolean): Promise<unknown> {
  return fetchAdmin(`/api/admin/doctors/${id}/active`, {
    method: 'PATCH',
    body: JSON.stringify({ isActive }),
  })
}

export async function createDoctor(data: {
  name: string
  email: string
  licenseNumber?: string
  specialty?: string
}): Promise<unknown> {
  return fetchAdmin('/api/admin/doctors', {
    method: 'POST',
    body: JSON.stringify(data),
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

export async function getAdminPharmacy(id: number): Promise<unknown> {
  return fetchAdmin(`/api/admin/pharmacies/${id}`)
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

// PRESCRIPTIONS
export async function getAdminPrescriptions(params?: {
  page?: number
  limit?: number
  search?: string
  status?: string
}): Promise<{
  prescriptions: unknown[]
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
export async function getAnalyticsOverview(): Promise<unknown> {
  return fetchAdmin('/api/admin/analytics/overview')
}

export async function getRequestsByStatus(): Promise<unknown> {
  return fetchAdmin('/api/admin/analytics/requests-by-status')
}

export async function getRecentActivity(): Promise<unknown> {
  return fetchAdmin('/api/admin/analytics/recent-activity')
}
