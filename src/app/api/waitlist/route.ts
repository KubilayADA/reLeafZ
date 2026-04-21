import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL;

export async function POST(req: NextRequest) {
  if (!BACKEND_URL) {
    console.error('[waitlist] NEXT_PUBLIC_API_URL is not set');
    return NextResponse.json(
      { error: 'Server configuration error.', reason: 'missing_backend_url' },
      { status: 500 },
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch (err) {
    console.error('[waitlist] failed to parse request body', err);
    return NextResponse.json(
      { error: 'Invalid request body.', reason: 'bad_request_json' },
      { status: 400 },
    );
  }

  const target = `${BACKEND_URL.replace(/\/+$/, '')}/api/waitinglist`;

  let upstream: Response;
  try {
    upstream = await fetch(target, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(body),
      cache: 'no-store',
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('[waitlist] upstream fetch failed', { target, message });
    return NextResponse.json(
      {
        error: 'Backend nicht erreichbar. Bitte erneut versuchen.',
        reason: 'upstream_unreachable',
        detail: message,
      },
      { status: 502 },
    );
  }

  const rawText = await upstream.text();
  let data: unknown = null;
  try {
    data = rawText ? JSON.parse(rawText) : null;
  } catch {
    console.error('[waitlist] upstream returned non-JSON', {
      status: upstream.status,
      bodyPreview: rawText.slice(0, 500),
    });
    return NextResponse.json(
      {
        error: `Backend-Fehler (Status ${upstream.status}).`,
        reason: 'upstream_non_json',
        status: upstream.status,
        bodyPreview: rawText.slice(0, 300),
      },
      { status: 502 },
    );
  }

  return NextResponse.json(data ?? {}, { status: upstream.status });
}
