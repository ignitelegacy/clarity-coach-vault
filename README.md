# The Clarity Coach Vault

A branded portal where Ignite Legacy members can browse, review, and hire experienced Clarity Coaches to close their Enagic sales calls.

Built with **Next.js 14** + **Supabase**, deployed on **Vercel**.

---

## 🚀 Setup Guide

### 1. Supabase — create a NEW project

1. Go to [supabase.com](https://supabase.com) → **New project**
2. Name it `clarity-coach-vault`, pick a region, save the password
3. Wait ~2 minutes for it to spin up
4. Go to **SQL Editor** → **+ New query**
5. Open the `SETUP.sql` file from this repo, copy the **entire contents**, paste into Supabase, and click **Run**
   - This creates all three tables, sets RLS policies, and seeds Kelly & Lindsey
6. Go to **Project Settings** → **API** — copy your Project URL and anon key

### 2. GitHub

1. Create a new repo called `clarity-coach-vault` (public)
2. Upload all files from this project folder
3. Commit

### 3. Vercel

1. Import the repo on [vercel.com/new](https://vercel.com/new)
2. Add these environment variables **before** deploying:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. Deploy

### 4. After deployment — finish setting up the seed coaches

Kelly and Lindsey are pre-loaded, but they don't have photos or calendar links yet. Go to your deployed site at `/admin` and:

1. Click **Edit** on Kelly → paste her photo URL and calendar link → Save
2. Click **Edit** on Lindsey → same

**For photos**: The easiest path is to upload each photo to Supabase Storage (create a public bucket called `coach-photos` via the Supabase dashboard), then paste the public URL into the coach form. You can also use any public image host.

---

## 📂 How it works

### Public site (`/`)
- Hero + intro explaining what a Clarity Coach is (paraphrased from your transcript)
- Commission structure table (matches your screenshot)
- Grid of approved coaches
- Clicking a coach opens their full profile
- Clicking "Hire" opens the hire flow: scrollable agreement box → checkbox → sponsor info form → success screen with the coach's calendar link + copy button
- "Apply to Become a Coach" button at the bottom opens an application form

### Admin (`/admin`) — unlisted, no password
Three tabs:
- **Coaches** — add / edit / delete coach profiles
- **Applications** — review pending coach applications, Approve → auto-creates a coach
- **Hire Submissions** — see every hire request that came through, with the sponsor's details and the coach they chose

---

## ⚖️ Important legal note

The Clarity Coach Service Agreement shown in the hire modal is a **fresh paraphrase** of standard terms for this kind of service, rebranded to Ignite Legacy. **It should be reviewed by a lawyer before going live.** Look for the `// TODO: legal review` marker in `lib/agreement.tsx`.

---

## 📧 Email delivery

Right now, the confirmation email is **not automated** — the success screen shows the calendar link directly, and you (admin) can see every submission in the admin dashboard. To fully automate an email with the link:
- **Option A**: Add a webhook from `/api/hire` to Go High Level → GHL sends the email
- **Option B**: Use Resend or Supabase Edge Functions to send email directly

Happy to wire up either one — just ask.
