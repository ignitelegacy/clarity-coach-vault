import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  const [coachesRes, appsRes, hiresRes] = await Promise.all([
    supabase.from('coaches').select('*').order('created_at', { ascending: true }),
    supabase.from('coach_applications').select('*').order('created_at', { ascending: false }),
    supabase.from('hire_submissions').select('*').order('created_at', { ascending: false }),
  ]);
  if (coachesRes.error) return NextResponse.json({ error: coachesRes.error.message }, { status: 500 });
  if (appsRes.error) return NextResponse.json({ error: appsRes.error.message }, { status: 500 });
  if (hiresRes.error) return NextResponse.json({ error: hiresRes.error.message }, { status: 500 });
  return NextResponse.json({
    coaches: coachesRes.data || [],
    applications: appsRes.data || [],
    hires: hiresRes.data || [],
  });
}

export async function POST(req: Request) {
  try {
    const { action, table, id, data } = await req.json();

    if (action === 'create-coach') {
      const { error } = await supabase.from('coaches').insert({ ...data, approved: true });
      if (error) return NextResponse.json({ error: error.message }, { status: 500 });
      return NextResponse.json({ ok: true });
    }
    if (action === 'update-coach') {
      const { error } = await supabase.from('coaches').update(data).eq('id', id);
      if (error) return NextResponse.json({ error: error.message }, { status: 500 });
      return NextResponse.json({ ok: true });
    }
    if (action === 'delete') {
      if (!table || !id) return NextResponse.json({ error: 'Missing table or id' }, { status: 400 });
      const { error } = await supabase.from(table).delete().eq('id', id);
      if (error) return NextResponse.json({ error: error.message }, { status: 500 });
      return NextResponse.json({ ok: true });
    }
    if (action === 'approve-application') {
      // Fetch application, create coach from it, mark application approved
      const { data: app, error: fetchErr } = await supabase
        .from('coach_applications').select('*').eq('id', id).single();
      if (fetchErr || !app) return NextResponse.json({ error: 'Application not found' }, { status: 404 });

      const coachData = {
        name: app.name,
        age: app.age,
        location: app.location,
        email: app.email,
        enagic_rank: app.enagic_rank,
        time_in_enagic: app.time_in_enagic,
        sales_results: app.sales_results,
        sales_experience: app.sales_experience,
        sales_style: app.sales_style,
        about: app.about,
        why_love: app.why_love,
        calendar_link: app.calendar_link || '',
        approved: true,
      };
      const { error: insertErr } = await supabase.from('coaches').insert(coachData);
      if (insertErr) return NextResponse.json({ error: insertErr.message }, { status: 500 });
      await supabase.from('coach_applications').update({ status: 'approved' }).eq('id', id);
      return NextResponse.json({ ok: true });
    }
    if (action === 'reject-application') {
      const { error } = await supabase.from('coach_applications').update({ status: 'rejected' }).eq('id', id);
      if (error) return NextResponse.json({ error: error.message }, { status: 500 });
      return NextResponse.json({ ok: true });
    }

    return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Unknown error' }, { status: 500 });
  }
}
