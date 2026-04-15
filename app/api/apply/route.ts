import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email } = body;
    if (!name || !email) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    const payload: any = {
      name,
      email,
      age: body.age ? parseInt(body.age) : null,
      location: body.location || null,
      instagram: body.instagram || null,
      enagic_rank: body.enagic_rank || null,
      time_in_enagic: body.time_in_enagic || null,
      sales_results: body.sales_results || null,
      sales_experience: body.sales_experience || null,
      sales_style: body.sales_style || null,
      about: body.about || null,
      why_love: body.why_love || null,
      calendar_link: body.calendar_link || null,
      status: 'pending',
    };
    const { error } = await supabase.from('coach_applications').insert(payload);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Unknown error' }, { status: 500 });
  }
}
