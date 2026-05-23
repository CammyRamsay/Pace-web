import { NextResponse } from 'next/server';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get('code');
  const error = searchParams.get('error');

  if (error || !code) {
    return NextResponse.redirect(new URL('/?strava_error=1', req.url));
  }

  const res = await fetch('https://www.strava.com/oauth/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      client_id: process.env.STRAVA_CLIENT_ID,
      client_secret: process.env.STRAVA_CLIENT_SECRET,
      code,
      grant_type: 'authorization_code',
    }),
  });

  if (!res.ok) {
    return NextResponse.redirect(new URL('/?strava_error=1', req.url));
  }

  const data = await res.json();
  const params = new URLSearchParams({
    _sat: data.access_token,
    _srt: data.refresh_token,
    _sexp: String(data.expires_at),
    _san: data.athlete?.firstname || '',
  });

  return NextResponse.redirect(new URL(`/?${params}`, req.url));
}
