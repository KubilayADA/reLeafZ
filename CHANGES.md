# Changelog

---

## ⚠️ ACTION REQUIRED — Backend `/api/treatment/finalize` — `src/app/payment/success/page.tsx`

**Frontend fix is done. Backend is NOT verified yet — this must be completed before launch.**

`totalPrice` and `deliveryFee` have been removed from the client request body, but if the backend still accepts and trusts these values from any client, an attacker can submit a free order by sending a crafted request directly to the API.

**Backend must:**
- Ignore any client-supplied `totalPrice` / `deliveryFee` (strict DTO — reject or strip unknown fields)
- Recompute `totalPrice` from product records in DB using the provided product IDs
- Derive `deliveryFee` from pharmacy config in DB, never from the request

---

## ⚠️ ACTION REQUIRED — Backend pharmacy endpoints — `src/form/PharmacyDashboard.tsx`

**Comment added on frontend. Backend is NOT verified yet — this must be completed before launch.**

`pharmacy_id` is stored in `localStorage` for UI context only. If any backend pharmacy endpoint does not verify that the authenticated session (httpOnly cookie) matches the `pharmacyId` in the request, an attacker can change the value in DevTools and access another pharmacy's orders, inventory, and analytics — a broken access control vulnerability (OWASP A01).

**Backend must:**
- On every `/api/pharmacy/:id/*` endpoint, confirm the session's authenticated pharmacy ID matches the `:id` in the URL
- Return `403 Forbidden` if they do not match

---

## ⚠️ ACTION REQUIRED — GDPR cookie consent — `src/components/ui/cookie.tsx`

**No code change yet — this must be done before adding any analytics or tracking scripts.**

The cookie consent banner stores preferences but never reads them back to block or load scripts. Accepting or declining has no real effect. This is a GDPR violation for a German medical platform if any non-essential scripts are ever added.

**Before adding any analytics:**
- Read consent from `localStorage` before loading any non-essential script
- Only load if `preferences.analytics === true`
```ts
const consent = JSON.parse(localStorage.getItem('cookie-preferences') || '{}')
if (consent.analytics) { /* load analytics */ }
```

---

## [2026-03-17] Security Fix — Console logs in production (multiple files)

**Changes:**
- `src/app/page.tsx` — removed `console.log(result.data)` (raw API response, potential PII)
- `src/app/page.tsx` — wrapped `console.error` on form submit with `NODE_ENV === 'development'` guard
- `src/form/mashallah.tsx` — removed `console.log` on email change (session event)
- `src/app/questionnaire/page.tsx` — removed `console.log` on symptom update (session event)

**Further action needed:** No

---

## [2026-03-17] Bug Fix — `src/app/payment/success/page.tsx`

**Issue:** `useEffect` called `finalizeRequest` without it in the dependency array, causing a stale closure over `API_BASE` and `requestId`.

**Changes:**
- Wrapped `finalizeRequest` in `useCallback([API_BASE, requestId])`
- Added `finalizeRequest` to `useEffect` dependency array

**Further action needed:** No

---

## [2026-03-17] Bug Fix — `src/app/marketplace/page.tsx`

**Issue:** `JSON.parse(treatmentData)` had no try/catch — a corrupted value silently broke the entire page.

**Changes:**
- Wrapped in try/catch; on failure clears the bad localStorage key, sets error state, returns early

**Further action needed:** No

---

## [2026-03-17] Bug Fix — `src/app/payment/prescription/page.tsx`

**Issue:** `JSON.parse(products)` had no try/catch — user got stuck on infinite loading with no explanation.

**Changes:**
- Wrapped in try/catch; on failure sets error "Missing payment information. Please go back and try again." and returns before any API call

**Further action needed:** No

---

## [2026-03-17] Bug Fix — `src/app/form/page.tsx`

**Issue:** `postcode` URL param had no format validation — any value rendered the form.

**Changes:**
- Added `isValidBerlinPostcode` guard: exactly 5 digits, range `10115–14199`
- Invalid postcode redirects to `/`

**Further action needed:** No

---

## [2026-03-17] Security Fix — `src/app/test/page.tsx`

**Issue:** `/test` page was accessible in production, exposing the full API surface and backend URL.

**Changes:**
- Deleted `src/app/test/page.tsx` entirely

**Further action needed:** No

---

## [2026-03-17] Bug Fix — `src/app/payment/success/page.tsx` (2)

**Issue:** `JSON.parse(selectedProducts)` had no try/catch — corrupted localStorage silently crashed the payment success flow.

**Changes:**
- Wrapped in try/catch; on failure sets `sessionError` state and returns early
- Added error UI: "Something went wrong with your session — please contact support"

**Further action needed:** No

---

## [2026-03-17] Security Fix — `src/app/payment/success/page.tsx`

**Issue:** `totalPrice` and `deliveryFee` from localStorage were sent to `/api/treatment/finalize` — attacker could set them to `0` and submit a free order.

**Changes:**
- Removed `totalPrice` and `deliveryFee` from request body
- Dropped `totalPrice` from the guard condition
- Added `localStorage.removeItem('deliveryFee')` on success

**Further action needed:** See top of file — backend verification still required
