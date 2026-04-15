-- =============================================================
-- CLARITY COACH VAULT — Full Supabase Setup
-- Run this ONCE in Supabase SQL Editor after creating a new project.
-- =============================================================

-- 1. COACHES table
create table if not exists coaches (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  age int,
  location text,
  email text not null,
  enagic_rank text,
  time_in_enagic text,
  sales_results text,
  sales_experience text,
  sales_style text,
  about text,
  why_love text,
  calendar_link text not null default '',
  photo_url text,
  approved boolean default true,
  created_at timestamptz default now()
);

-- 2. COACH APPLICATIONS table (people applying to become a coach)
create table if not exists coach_applications (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  age int,
  location text,
  email text not null,
  instagram text,
  enagic_rank text,
  time_in_enagic text,
  sales_results text,
  sales_experience text,
  sales_style text,
  about text,
  why_love text,
  calendar_link text,
  status text default 'pending', -- pending | approved | rejected
  created_at timestamptz default now()
);

-- 3. HIRE SUBMISSIONS table (people hiring a coach)
create table if not exists hire_submissions (
  id uuid primary key default gen_random_uuid(),
  coach_id uuid references coaches(id) on delete set null,
  coach_name text,
  sponsor_name text not null,
  sponsor_email text not null,
  sponsor_instagram text,
  sponsor_enagic_id text,
  notes text,
  agreed_to_terms boolean default false,
  created_at timestamptz default now()
);

-- =============================================================
-- Row Level Security policies (public read/write — admin URL is unlisted)
-- =============================================================

alter table coaches enable row level security;
alter table coach_applications enable row level security;
alter table hire_submissions enable row level security;

create policy "public select coaches" on coaches for select to public using (true);
create policy "public insert coaches" on coaches for insert to public with check (true);
create policy "public update coaches" on coaches for update to public using (true);
create policy "public delete coaches" on coaches for delete to public using (true);

create policy "public select applications" on coach_applications for select to public using (true);
create policy "public insert applications" on coach_applications for insert to public with check (true);
create policy "public update applications" on coach_applications for update to public using (true);
create policy "public delete applications" on coach_applications for delete to public using (true);

create policy "public select hires" on hire_submissions for select to public using (true);
create policy "public insert hires" on hire_submissions for insert to public with check (true);
create policy "public update hires" on hire_submissions for update to public using (true);
create policy "public delete hires" on hire_submissions for delete to public using (true);

-- =============================================================
-- SEED DATA — Kelly Atwood & Lindsey Sun
-- =============================================================

insert into coaches (name, age, location, email, enagic_rank, time_in_enagic, sales_results, sales_experience, sales_style, about, why_love, calendar_link, approved)
values
(
  'Kelly Atwood',
  43,
  'Austin, TX',
  'kellyjeanneatwood@gmail.com',
  '6A2',
  '8 years',
  'Generated over $1M in combined sales through my Enagic organization, supporting the wider Enagic community and my private coaching business. I''ve been a sales trainer since 2015, and have coached over a thousand individuals on mastering their sales process.',
  '12 years in high-ticket sales; 2 years in low-ticket network marketing; and 14 years in transformational coaching.',
  'I lead with a grounded blend of gentleness and bold truth. I create a space where people feel deeply seen and heard, while also being challenged to rise into what they say they truly want. I bring emotional safety and sharp clarity to every conversation. I close by guiding, not pushing — empowering people to see what''s possible and choose their next level for themselves.',
  'I''m a transformational coach, high-ticket sales leader, and an international speaker who built a freedom-first life by design. In my early thirties, I was struggling — depressed, disconnected, and stuck in patterns that kept me small. Discovering personal development and online business changed everything. Now, I travel the world, build businesses that create impact and income, and help others step into their next level with clarity, confidence, and conviction.',
  'I deeply believe that the life someone dreams about is already available to them — it just requires a decision. I love being the space where that decision becomes clear. The conversation where excuses fall away, possibilities expand, and someone realizes they''re capable of more than they''ve been settling for. As a Clarity Coach, I get to stand at that inflection point with people and support them in choosing their next level.',
  '',
  true
),
(
  'Lindsey Sun',
  34,
  'From Auckland, New Zealand — recently relocated to Bali, Indonesia',
  'lindsey.t.sun@gmail.com',
  '5A',
  '2.5 years',
  '$185,790 USD in sales volume closed',
  '2.5 years of high-ticket sales inside Enagic',
  'I''m warm, grounded, and direct. I hold space for people to feel seen and heard while powerfully calling them forward. My approach is both intuitive and outcome-driven. I guide people to aligned decisions with heart and conviction.',
  'I''m a mum to two young children (2 and 3 years old) with baby number three on the way. I recently sold my home in New Zealand, packed up my life, and moved to Bali to create more freedom, alignment, and presence for myself and my family. I''m passionate about conscious motherhood, holistic living, and building a life on my own terms.',
  'I''m deeply committed to showing women — especially mothers — that they can create income without compromising their values or missing the moments that matter. I''m a living example of what''s possible when you choose alignment over expectation, and I''m here to help others see what''s possible for them too.',
  '',
  true
);

-- =============================================================
-- IMPORTANT: After running this, go to the admin page and edit
-- Kelly and Lindsey to add their calendar/booking links + photo URLs.
-- =============================================================
