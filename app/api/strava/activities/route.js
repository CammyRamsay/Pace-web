import { NextResponse } from 'next/server';

export async function POST(req) {
  const { access_token } = await req.json();

  const allActivities = [];
  let page = 1;

  while (true) {
    const res = await fetch(
      `https://www.strava.com/api/v3/athlete/activities?per_page=200&page=${page}`,
      { headers: { Authorization: `Bearer ${access_token}` } }
    );

    if (!res.ok) return NextResponse.json({ error: 'fetch_failed' }, { status: 400 });

    const batch = await res.json();
    if (!Array.isArray(batch) || batch.length === 0) break;

    const runs = batch.filter((a) =>
      ['Run', 'TrailRun', 'VirtualRun'].includes(a.sport_type || a.type)
    );
    allActivities.push(...runs);
    if (batch.length < 200) break;
    page++;
  }

  return NextResponse.json({ activities: allActivities });
}
