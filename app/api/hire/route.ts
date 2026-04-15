import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { coach_id, coach_name, sponsor_name, sponsor_email, sponsor_instagram, sponsor_enagic_id, notes } = body;
    if (!coach_id || !sponsor_name || !sponsor_email) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    const { error } = await supabase.from('hire_submissions').insert({
      coach_id, coach_name,
      sponsor_name, sponsor_email,
      sponsor_instagram: sponsor_instagram || null,
      sponsor_enagic_id: sponsor_enagic_id || null,
      notes: notes || null,
      agreed_to_terms: true,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Unknown error' }, { status: 500 });
  }
}
